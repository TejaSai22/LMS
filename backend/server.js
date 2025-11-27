require('dotenv').config({ path: 'backend/.env' });
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON bodies

// Create a connection pool using environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test the database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database', err.stack);
  } else {
    console.log('Successfully connected to the database at', res.rows[0].now);
  }
});

// Middleware to protect routes and check roles
const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [
    // 1. Authenticate JWT
    (req, res, next) => {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (token == null) return res.sendStatus(401);

      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
      });
    },
    // 2. Authorize based on role
    (req, res, next) => {
      if (roles.length && !roles.includes(req.user.role)) {
        return res.sendStatus(403);
      }
      next();
    },
  ];
};

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// --- Course Endpoints ---
app.get('/api/courses', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM Course');
    res.json(rows);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error fetching courses');
  }
});

app.get('/api/courses/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rows } = await pool.query('SELECT * FROM Course WHERE CourseID = $1', [courseId]);
    if (rows.length === 0) {
      return res.status(404).send('Course not found');
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error fetching course');
  }
});

// --- Assignment Endpoints ---
app.post('/api/courses/:courseOfferingId/assignments', authorize('Instructor'), async (req, res) => {
  try {
    const { courseOfferingId } = req.params;
    const { Title, Description, MaxPoints, DueDate, WeightPercentage } = req.body;
    const offeringResult = await pool.query('SELECT InstructorID FROM CourseOffering WHERE OfferingID = $1', [courseOfferingId]);
    if (offeringResult.rows.length === 0) return res.status(404).send('Course offering not found');
    if (offeringResult.rows[0].instructorid !== req.user.userId) return res.status(403).send('You are not authorized to add assignments to this course');
    const { rows } = await pool.query(
      'INSERT INTO Assignment (OfferingID, Title, Description, MaxPoints, DueDate, WeightPercentage) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [courseOfferingId, Title, Description, MaxPoints, DueDate, WeightPercentage]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error creating assignment');
  }
});

app.get('/api/courses/:courseOfferingId/assignments', authorize(), async (req, res) => {
  try {
    const { courseOfferingId } = req.params;
    const offeringResult = await pool.query('SELECT InstructorID FROM CourseOffering WHERE OfferingID = $1', [courseOfferingId]);
    if (offeringResult.rows.length === 0) return res.status(404).send('Course offering not found');
    const isInstructor = offeringResult.rows[0].instructorid === req.user.userId;
    const enrollmentResult = await pool.query('SELECT * FROM Enrollment WHERE OfferingID = $1 AND StudentID = $2', [courseOfferingId, req.user.userId]);
    const isEnrolled = enrollmentResult.rows.length > 0;
    if (!isInstructor && !isEnrolled) return res.status(403).send('You are not authorized to view assignments for this course');
    const { rows } = await pool.query('SELECT * FROM Assignment WHERE OfferingID = $1', [courseOfferingId]);
    res.json(rows);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error fetching assignments');
  }
});

app.get('/api/assignments/:assignmentId', authorize(), async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignmentResult = await pool.query('SELECT * FROM Assignment WHERE AssignmentID = $1', [assignmentId]);
    if (assignmentResult.rows.length === 0) return res.status(404).send('Assignment not found');
    const assignment = assignmentResult.rows[0];
    const offeringResult = await pool.query('SELECT InstructorID FROM CourseOffering WHERE OfferingID = $1', [assignment.offeringid]);
    const isInstructor = offeringResult.rows[0].instructorid === req.user.userId;
    const enrollmentResult = await pool.query('SELECT * FROM Enrollment WHERE OfferingID = $1 AND StudentID = $2', [assignment.offeringid, req.user.userId]);
    const isEnrolled = enrollmentResult.rows.length > 0;
    if (!isInstructor && !isEnrolled) return res.status(403).send('You are not authorized to view this assignment');
    res.json(assignment);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error fetching assignment');
  }
});

app.put('/api/assignments/:assignmentId', authorize('Instructor'), async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { Title, Description, MaxPoints, DueDate, WeightPercentage } = req.body;
    const assignmentResult = await pool.query('SELECT OfferingID FROM Assignment WHERE AssignmentID = $1', [assignmentId]);
    if (assignmentResult.rows.length === 0) return res.status(404).send('Assignment not found');
    const offeringId = assignmentResult.rows[0].offeringid;
    const offeringResult = await pool.query('SELECT InstructorID FROM CourseOffering WHERE OfferingID = $1', [offeringId]);
    if (offeringResult.rows[0].instructorid !== req.user.userId) return res.status(403).send('You are not authorized to update assignments for this course');
    const { rows } = await pool.query(
      'UPDATE Assignment SET Title = $1, Description = $2, MaxPoints = $3, DueDate = $4, WeightPercentage = $5 WHERE AssignmentID = $6 RETURNING *',
      [Title, Description, MaxPoints, DueDate, WeightPercentage, assignmentId]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error updating assignment');
  }
});

app.delete('/api/assignments/:assignmentId', authorize('Instructor'), async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignmentResult = await pool.query('SELECT OfferingID FROM Assignment WHERE AssignmentID = $1', [assignmentId]);
    if (assignmentResult.rows.length === 0) return res.status(404).send('Assignment not found');
    const offeringId = assignmentResult.rows[0].offeringid;
    const offeringResult = await pool.query('SELECT InstructorID FROM CourseOffering WHERE OfferingID = $1', [offeringId]);
    if (offeringResult.rows[0].instructorid !== req.user.userId) return res.status(403).send('You are not authorized to delete assignments for this course');
    await pool.query('DELETE FROM Assignment WHERE AssignmentID = $1', [assignmentId]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error deleting assignment');
  }
});

// --- Submission Endpoints ---
app.post('/api/assignments/:assignmentId/submissions', authorize('Student'), async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const studentId = req.user.userId;
    const { FileURL, SubmissionText } = req.body;
    const assignmentResult = await pool.query('SELECT OfferingID, DueDate FROM Assignment WHERE AssignmentID = $1', [assignmentId]);
    if (assignmentResult.rows.length === 0) return res.status(404).send('Assignment not found');
    const { offeringid, duedate } = assignmentResult.rows[0];
    const enrollmentResult = await pool.query('SELECT * FROM Enrollment WHERE OfferingID = $1 AND StudentID = $2', [offeringid, studentId]);
    if (enrollmentResult.rows.length === 0) return res.status(403).send('You are not enrolled in the course for this assignment');
    const isLate = new Date() > new Date(duedate);
    const versionResult = await pool.query('SELECT MAX(VersionNumber) as max_version FROM Submission WHERE AssignmentID = $1 AND StudentID = $2', [assignmentId, studentId]);
    const nextVersion = (versionResult.rows[0].max_version || 0) + 1;
    const { rows } = await pool.query(
      'INSERT INTO Submission (AssignmentID, StudentID, FileURL, SubmissionText, IsLate, VersionNumber) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [assignmentId, studentId, FileURL, SubmissionText, isLate, nextVersion]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error creating submission');
  }
});

app.get('/api/assignments/:assignmentId/submissions', authorize(), async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { userId, role } = req.user;
    const assignmentResult = await pool.query('SELECT OfferingID FROM Assignment WHERE AssignmentID = $1', [assignmentId]);
    if (assignmentResult.rows.length === 0) return res.status(404).send('Assignment not found');
    const { offeringid } = assignmentResult.rows[0];
    const offeringResult = await pool.query('SELECT InstructorID FROM CourseOffering WHERE OfferingID = $1', [offeringid]);
    const isInstructor = offeringResult.rows[0].instructorid === userId;
    if (role === 'Instructor' && isInstructor) {
      const { rows } = await pool.query('SELECT * FROM Submission WHERE AssignmentID = $1', [assignmentId]);
      return res.json(rows);
    }
    if (role === 'Student') {
      const enrollmentResult = await pool.query('SELECT * FROM Enrollment WHERE OfferingID = $1 AND StudentID = $2', [offeringid, userId]);
      if (enrollmentResult.rows.length === 0) return res.status(403).send('You are not authorized to view submissions for this assignment');
      const { rows } = await pool.query('SELECT * FROM Submission WHERE AssignmentID = $1 AND StudentID = $2', [assignmentId, userId]);
      return res.json(rows);
    }
    return res.status(403).send('You are not authorized to view submissions for this assignment');
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error fetching submissions');
  }
});

app.patch('/api/submissions/:submissionId', authorize('Instructor'), async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { Score, Feedback } = req.body;
    const submissionResult = await pool.query('SELECT s.AssignmentID, a.OfferingID FROM Submission s JOIN Assignment a ON s.AssignmentID = a.AssignmentID WHERE s.SubmissionID = $1', [submissionId]);
    if (submissionResult.rows.length === 0) return res.status(404).send('Submission not found');
    const { offeringid } = submissionResult.rows[0];
    const offeringResult = await pool.query('SELECT InstructorID FROM CourseOffering WHERE OfferingID = $1', [offeringid]);
    if (offeringResult.rows[0].instructorid !== req.user.userId) return res.status(403).send('You are not authorized to grade submissions for this course');
    const { rows } = await pool.query(
      'UPDATE Submission SET Score = $1, Feedback = $2, GradedDate = NOW(), GradedByID = $3 WHERE SubmissionID = $4 RETURNING *',
      [Score, Feedback, req.user.userId, submissionId]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error grading submission');
  }
});

// --- Quiz Endpoints ---
app.post('/api/courses/:courseOfferingId/quizzes', authorize('Instructor'), async (req, res) => {
  try {
    const { courseOfferingId } = req.params;
    const { Title, Description, MaxPoints, DueDate, TimeLimit, WeightPercentage } = req.body;
    const offeringResult = await pool.query('SELECT InstructorID FROM CourseOffering WHERE OfferingID = $1', [courseOfferingId]);
    if (offeringResult.rows.length === 0) return res.status(404).send('Course offering not found');
    if (offeringResult.rows[0].instructorid !== req.user.userId) return res.status(403).send('You are not authorized to add quizzes to this course');
    const { rows } = await pool.query(
      'INSERT INTO Quiz (OfferingID, Title, Description, MaxPoints, DueDate, TimeLimit, WeightPercentage) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [courseOfferingId, Title, Description, MaxPoints, DueDate, TimeLimit, WeightPercentage]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error creating quiz');
  }
});

app.get('/api/courses/:courseOfferingId/quizzes', authorize(), async (req, res) => {
  try {
    const { courseOfferingId } = req.params;
    const offeringResult = await pool.query('SELECT InstructorID FROM CourseOffering WHERE OfferingID = $1', [courseOfferingId]);
    if (offeringResult.rows.length === 0) return res.status(404).send('Course offering not found');
    const isInstructor = offeringResult.rows[0].instructorid === req.user.userId;
    const enrollmentResult = await pool.query('SELECT * FROM Enrollment WHERE OfferingID = $1 AND StudentID = $2', [courseOfferingId, req.user.userId]);
    const isEnrolled = enrollmentResult.rows.length > 0;
    if (!isInstructor && !isEnrolled) return res.status(403).send('You are not authorized to view quizzes for this course');
    const { rows } = await pool.query('SELECT * FROM Quiz WHERE OfferingID = $1', [courseOfferingId]);
    res.json(rows);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error fetching quizzes');
  }
});

app.get('/api/quizzes/:quizId', authorize(), async (req, res) => {
  try {
    const { quizId } = req.params;
    const quizResult = await pool.query('SELECT * FROM Quiz WHERE QuizID = $1', [quizId]);
    if (quizResult.rows.length === 0) return res.status(404).send('Quiz not found');
    const quiz = quizResult.rows[0];
    const offeringResult = await pool.query('SELECT InstructorID FROM CourseOffering WHERE OfferingID = $1', [quiz.offeringid]);
    const isInstructor = offeringResult.rows[0].instructorid === req.user.userId;
    const enrollmentResult = await pool.query('SELECT * FROM Enrollment WHERE OfferingID = $1 AND StudentID = $2', [quiz.offeringid, req.user.userId]);
    const isEnrolled = enrollmentResult.rows.length > 0;
    if (!isInstructor && !isEnrolled) return res.status(403).send('You are not authorized to view this quiz');
    res.json(quiz);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error fetching quiz');
  }
});

app.put('/api/quizzes/:quizId', authorize('Instructor'), async (req, res) => {
  try {
    const { quizId } = req.params;
    const { Title, Description, MaxPoints, DueDate, TimeLimit, WeightPercentage } = req.body;
    const quizResult = await pool.query('SELECT OfferingID FROM Quiz WHERE QuizID = $1', [quizId]);
    if (quizResult.rows.length === 0) return res.status(404).send('Quiz not found');
    const offeringId = quizResult.rows[0].offeringid;
    const offeringResult = await pool.query('SELECT InstructorID FROM CourseOffering WHERE OfferingID = $1', [offeringId]);
    if (offeringResult.rows[0].instructorid !== req.user.userId) return res.status(403).send('You are not authorized to update quizzes for this course');
    const { rows } = await pool.query(
      'UPDATE Quiz SET Title = $1, Description = $2, MaxPoints = $3, DueDate = $4, TimeLimit = $5, WeightPercentage = $6 WHERE QuizID = $7 RETURNING *',
      [Title, Description, MaxPoints, DueDate, TimeLimit, WeightPercentage, quizId]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error updating quiz');
  }
});

app.delete('/api/quizzes/:quizId', authorize('Instructor'), async (req, res) => {
  try {
    const { quizId } = req.params;
    const quizResult = await pool.query('SELECT OfferingID FROM Quiz WHERE QuizID = $1', [quizId]);
    if (quizResult.rows.length === 0) return res.status(404).send('Quiz not found');
    const offeringId = quizResult.rows[0].offeringid;
    const offeringResult = await pool.query('SELECT InstructorID FROM CourseOffering WHERE OfferingID = $1', [offeringId]);
    if (offeringResult.rows[0].instructorid !== req.user.userId) return res.status(403).send('You are not authorized to delete quizzes for this course');
    await pool.query('DELETE FROM Quiz WHERE QuizID = $1', [quizId]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error deleting quiz');
  }
});

// --- Quiz Attempt Endpoints ---
app.post('/api/quizzes/:quizId/attempts', authorize('Student'), async (req, res) => {
  try {
    const { quizId } = req.params;
    const studentId = req.user.userId;
    const quizResult = await pool.query('SELECT OfferingID, NumberOfAttempts FROM Quiz WHERE QuizID = $1', [quizId]);
    if (quizResult.rows.length === 0) return res.status(404).send('Quiz not found');
    const { offeringid, numberofattempts } = quizResult.rows[0];
    const enrollmentResult = await pool.query('SELECT * FROM Enrollment WHERE OfferingID = $1 AND StudentID = $2', [offeringid, studentId]);
    if (enrollmentResult.rows.length === 0) return res.status(403).send('You are not enrolled in the course for this quiz');
    const attemptResult = await pool.query('SELECT COUNT(*) as attempt_count FROM QuizAttempt WHERE QuizID = $1 AND StudentID = $2', [quizId, studentId]);
    if (attemptResult.rows[0].attempt_count >= numberofattempts) return res.status(403).send('You have exceeded the maximum number of attempts for this quiz');
    const nextAttemptNumber = parseInt(attemptResult.rows[0].attempt_count) + 1;
    const { rows } = await pool.query(
      'INSERT INTO QuizAttempt (QuizID, StudentID, AttemptNumber, StartTime) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [quizId, studentId, nextAttemptNumber]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error starting quiz attempt');
  }
});

app.patch('/api/attempts/:attemptId', authorize('Student'), async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { responses } = req.body;
    const attemptResult = await pool.query('SELECT * FROM QuizAttempt WHERE AttemptID = $1', [attemptId]);
    if (attemptResult.rows.length === 0) return res.status(404).send('Quiz attempt not found');
    const attempt = attemptResult.rows[0];
    if (attempt.studentid !== req.user.userId) return res.status(403).send('You are not authorized to submit this quiz attempt');
    if (attempt.submittime) return res.status(400).send('This quiz has already been submitted');
    const { rows } = await pool.query(
      'UPDATE QuizAttempt SET SubmitTime = NOW(), ResponsesJSON = $1, IsCompleted = TRUE WHERE AttemptID = $2 RETURNING *',
      [responses, attemptId]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error submitting quiz attempt');
  }
});

app.get('/api/quizzes/:quizId/attempts', authorize(), async (req, res) => {
  try {
    const { quizId } = req.params;
    const { userId, role } = req.user;
    const quizResult = await pool.query('SELECT OfferingID FROM Quiz WHERE QuizID = $1', [quizId]);
    if (quizResult.rows.length === 0) return res.status(404).send('Quiz not found');
    const { offeringid } = quizResult.rows[0];
    const offeringResult = await pool.query('SELECT InstructorID FROM CourseOffering WHERE OfferingID = $1', [offeringid]);
    const isInstructor = offeringResult.rows[0].instructorid === userId;
    if (role === 'Instructor' && isInstructor) {
      const { rows } = await pool.query('SELECT * FROM QuizAttempt WHERE QuizID = $1', [quizId]);
      return res.json(rows);
    }
    if (role === 'Student') {
      const enrollmentResult = await pool.query('SELECT * FROM Enrollment WHERE OfferingID = $1 AND StudentID = $2', [offeringid, userId]);
      if (enrollmentResult.rows.length === 0) return res.status(403).send('You are not authorized to view attempts for this quiz');
      const { rows } = await pool.query('SELECT * FROM QuizAttempt WHERE QuizID = $1 AND StudentID = $2', [quizId, userId]);
      return res.json(rows);
    }
    return res.status(403).send('You are not authorized to view attempts for this quiz');
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error fetching quiz attempts');
  }
});

app.patch('/api/attempts/:attemptId/grade', authorize('Instructor'), async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { Score } = req.body;
    const attemptResult = await pool.query('SELECT qa.QuizID, q.OfferingID FROM QuizAttempt qa JOIN Quiz q ON qa.QuizID = q.QuizID WHERE qa.AttemptID = $1', [attemptId]);
    if (attemptResult.rows.length === 0) return res.status(404).send('Quiz attempt not found');
    const { offeringid } = attemptResult.rows[0];
    const offeringResult = await pool.query('SELECT InstructorID FROM CourseOffering WHERE OfferingID = $1', [offeringid]);
    if (offeringResult.rows[0].instructorid !== req.user.userId) return res.status(403).send('You are not authorized to grade attempts for this course');
    const { rows } = await pool.query(
      'UPDATE QuizAttempt SET Score = $1 WHERE AttemptID = $2 RETURNING *',
      [Score, attemptId]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error grading quiz attempt');
  }
});

// --- Module Endpoints ---
app.post('/api/courses/:courseOfferingId/modules', authorize('Instructor'), async (req, res) => {
  try {
    const { courseOfferingId } = req.params;
    const { ModuleName, Description, SequenceNumber } = req.body;

    if (!ModuleName || !SequenceNumber) {
      return res.status(400).send('ModuleName and SequenceNumber are required');
    }

    const offeringResult = await pool.query('SELECT InstructorID FROM CourseOffering WHERE OfferingID = $1', [courseOfferingId]);
    if (offeringResult.rows.length === 0) return res.status(404).send('Course offering not found');
    if (offeringResult.rows[0].instructorid !== req.user.userId) return res.status(403).send('You are not authorized to add modules to this course');
    const { rows } = await pool.query(
      'INSERT INTO Module (OfferingID, ModuleName, Description, SequenceNumber) VALUES ($1, $2, $3, $4) RETURNING *',
      [courseOfferingId, ModuleName, Description, SequenceNumber]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error creating module');
  }
});

app.get('/api/courses/:courseOfferingId/modules', authorize(), async (req, res) => {
  try {
    const { courseOfferingId } = req.params;
    const offeringResult = await pool.query('SELECT InstructorID FROM CourseOffering WHERE OfferingID = $1', [courseOfferingId]);
    if (offeringResult.rows.length === 0) return res.status(404).send('Course offering not found');

    const isInstructor = offeringResult.rows[0].instructorid === req.user.userId;
    const enrollmentResult = await pool.query('SELECT * FROM Enrollment WHERE OfferingID = $1 AND StudentID = $2', [courseOfferingId, req.user.userId]);
    const isEnrolled = enrollmentResult.rows.length > 0;

    if (!isInstructor && !isEnrolled) {
      return res.status(403).send('You are not authorized to view modules for this course');
    }

    const { rows } = await pool.query('SELECT * FROM Module WHERE OfferingID = $1 ORDER BY SequenceNumber', [courseOfferingId]);
    res.json(rows);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error fetching modules');
  }
});

app.put('/api/modules/:moduleId', authorize('Instructor'), async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { ModuleName, Description, SequenceNumber } = req.body;

    if (!ModuleName || !SequenceNumber) {
      return res.status(400).send('ModuleName and SequenceNumber are required');
    }

    // First, get the offering ID from the module
    const moduleResult = await pool.query('SELECT OfferingID FROM Module WHERE ModuleID = $1', [moduleId]);
    if (moduleResult.rows.length === 0) {
      return res.status(404).send('Module not found');
    }
    const { offeringid } = moduleResult.rows[0];

    // Then, verify the instructor owns the course offering
    const offeringResult = await pool.query('SELECT InstructorID FROM CourseOffering WHERE OfferingID = $1', [offeringid]);
    if (offeringResult.rows.length === 0) {
       // This case should ideally not be reached if DB integrity is maintained
      return res.status(404).send('Course offering not found');
    }
    if (offeringResult.rows[0].instructorid !== req.user.userId) {
      return res.status(403).send('You are not authorized to update modules for this course');
    }

    // Update the module
    const { rows } = await pool.query(
      'UPDATE Module SET ModuleName = $1, Description = $2, SequenceNumber = $3 WHERE ModuleID = $4 RETURNING *',
      [ModuleName, Description, SequenceNumber, moduleId]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error updating module');
  }
});

app.delete('/api/modules/:moduleId', authorize('Instructor'), async (req, res) => {
  try {
    const { moduleId } = req.params;

    // First, get the offering ID from the module
    const moduleResult = await pool.query('SELECT OfferingID FROM Module WHERE ModuleID = $1', [moduleId]);
    if (moduleResult.rows.length === 0) {
      return res.status(404).send('Module not found');
    }
    const { offeringid } = moduleResult.rows[0];

    // Then, verify the instructor owns the course offering
    const offeringResult = await pool.query('SELECT InstructorID FROM CourseOffering WHERE OfferingID = $1', [offeringid]);
     if (offeringResult.rows.length === 0) {
      return res.status(404).send('Course offering not found');
    }
    if (offeringResult.rows[0].instructorid !== req.user.userId) {
      return res.status(403).send('You are not authorized to delete modules for this course');
    }

    // Delete the module
    await pool.query('DELETE FROM Module WHERE ModuleID = $1', [moduleId]);
    res.sendStatus(204); // No Content
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error deleting module');
  }
});

// --- Material Endpoints ---

// POST a new material to a module
app.post('/api/modules/:moduleId/materials', authorize('Instructor'), async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { Title, Description, ContentType, FileURL, SequenceNumber } = req.body;

    if (!Title || !ContentType || !SequenceNumber) {
      return res.status(400).send('Title, ContentType, and SequenceNumber are required');
    }

    // Verify instructor owns the module
    const moduleResult = await pool.query('SELECT m.OfferingID, co.InstructorID FROM Module m JOIN CourseOffering co ON m.OfferingID = co.OfferingID WHERE m.ModuleID = $1', [moduleId]);
    if (moduleResult.rows.length === 0) return res.status(404).send('Module not found');
    if (moduleResult.rows[0].instructorid !== req.user.userId) return res.status(403).send('You are not authorized to add materials to this module');

    const { rows } = await pool.query(
      'INSERT INTO Material (ModuleID, Title, Description, ContentType, FileURL, SequenceNumber) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [moduleId, Title, Description, ContentType, FileURL, SequenceNumber]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error creating material');
  }
});

// GET all materials for a module
app.get('/api/modules/:moduleId/materials', authorize(), async (req, res) => {
  try {
    const { moduleId } = req.params;

    // Verify user is enrolled or is the instructor
    const moduleResult = await pool.query('SELECT m.OfferingID, co.InstructorID FROM Module m JOIN CourseOffering co ON m.OfferingID = co.OfferingID WHERE m.ModuleID = $1', [moduleId]);
    if (moduleResult.rows.length === 0) return res.status(404).send('Module not found');

    const { offeringid, instructorid } = moduleResult.rows[0];
    const isInstructor = instructorid === req.user.userId;
    const enrollmentResult = await pool.query('SELECT * FROM Enrollment WHERE OfferingID = $1 AND StudentID = $2', [offeringid, req.user.userId]);
    const isEnrolled = enrollmentResult.rows.length > 0;

    if (!isInstructor && !isEnrolled) {
      return res.status(403).send('You are not authorized to view materials for this module');
    }

    const { rows } = await pool.query('SELECT * FROM Material WHERE ModuleID = $1 ORDER BY SequenceNumber', [moduleId]);
    res.json(rows);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error fetching materials');
  }
});

// PUT (update) a specific material
app.put('/api/materials/:materialId', authorize('Instructor'), async (req, res) => {
  try {
    const { materialId } = req.params;
    const { Title, Description, ContentType, FileURL, SequenceNumber } = req.body;

    if (!Title || !ContentType || !SequenceNumber) {
      return res.status(400).send('Title, ContentType, and SequenceNumber are required');
    }

    // Verify instructor owns the material
    const materialResult = await pool.query('SELECT m.ModuleID, mo.OfferingID, co.InstructorID FROM Material m JOIN Module mo ON m.ModuleID = mo.ModuleID JOIN CourseOffering co ON mo.OfferingID = co.OfferingID WHERE m.MaterialID = $1', [materialId]);
    if (materialResult.rows.length === 0) return res.status(404).send('Material not found');
    if (materialResult.rows[0].instructorid !== req.user.userId) return res.status(403).send('You are not authorized to update this material');

    const { rows } = await pool.query(
      'UPDATE Material SET Title = $1, Description = $2, ContentType = $3, FileURL = $4, SequenceNumber = $5 WHERE MaterialID = $6 RETURNING *',
      [Title, Description, ContentType, FileURL, SequenceNumber, materialId]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error updating material');
  }
});

// DELETE a specific material
app.delete('/api/materials/:materialId', authorize('Instructor'), async (req, res) => {
  try {
    const { materialId } = req.params;

    // Verify instructor owns the material
    const materialResult = await pool.query('SELECT m.ModuleID, mo.OfferingID, co.InstructorID FROM Material m JOIN Module mo ON m.ModuleID = mo.ModuleID JOIN CourseOffering co ON mo.OfferingID = co.OfferingID WHERE m.MaterialID = $1', [materialId]);
    if (materialResult.rows.length === 0) return res.status(404).send('Material not found');
    if (materialResult.rows[0].instructorid !== req.user.userId) return res.status(403).send('You are not authorized to delete this material');

    await pool.query('DELETE FROM Material WHERE MaterialID = $1', [materialId]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error deleting material');
  }
});

// --- User & Auth Endpoints ---
app.get('/api/users', authorize('Admin'), async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT UserID, FirstName, LastName, Email, Role, DateCreated, LastLogin, IsActive FROM "User"');
    res.json(rows);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error fetching users');
  }
});

app.get('/api/users/:userId/courses', authorize(), async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.user.userId !== parseInt(userId) && req.user.role !== 'Admin') return res.sendStatus(403);
    const query = `
      SELECT c.*
      FROM Course c
      JOIN CourseOffering co ON c.CourseID = co.CourseID
      JOIN Enrollment e ON co.OfferingID = e.OfferingID
      WHERE e.StudentID = $1;
    `;
    const { rows } = await pool.query(query, [userId]);
    res.json(rows);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error fetching user courses');
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { FirstName, LastName, Email, Password, Role } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);
    const { rows } = await pool.query(
      'INSERT INTO "User" (FirstName, LastName, Email, PasswordHash, Role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [FirstName, LastName, Email, hashedPassword, Role]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error creating user');
  }
});

app.post('/api/enrollments', authorize(['Admin', 'Instructor']), async (req, res) => {
  try {
    const { StudentID, OfferingID } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO Enrollment (StudentID, OfferingID) VALUES ($1, $2) RETURNING *',
      [StudentID, OfferingID]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error creating enrollment');
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const { rows } = await pool.query('SELECT * FROM "User" WHERE Email = $1', [Email]);
    if (rows.length === 0) return res.status(400).send('Invalid email or password');
    const user = rows[0];
    const validPassword = await bcrypt.compare(Password, user.passwordhash);
    if (!validPassword) return res.status(400).send('Invalid email or password');
    const token = jwt.sign({ userId: user.userid, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error logging in');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
