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

// API endpoint to get all courses
app.get('/api/courses', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM Course');
    res.json(rows);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error fetching courses');
  }
});

// API endpoint to get a single course by ID
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

// API endpoint to create an assignment for a course offering
app.post('/api/courses/:courseOfferingId/assignments', authorize('Instructor'), async (req, res) => {
  try {
    const { courseOfferingId } = req.params;
    const { Title, Description, MaxPoints, DueDate, WeightPercentage } = req.body;

    // Verify that the instructor is teaching this course
    const offeringResult = await pool.query('SELECT InstructorID FROM CourseOffering WHERE OfferingID = $1', [courseOfferingId]);
    if (offeringResult.rows.length === 0) {
      return res.status(404).send('Course offering not found');
    }
    if (offeringResult.rows[0].instructorid !== req.user.userId) {
      return res.status(403).send('You are not authorized to add assignments to this course');
    }

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

// API endpoint to get all assignments for a course offering
app.get('/api/courses/:courseOfferingId/assignments', authorize(), async (req, res) => {
  try {
    const { courseOfferingId } = req.params;

    // Verify that the user is either the instructor or enrolled in the course
    const offeringResult = await pool.query('SELECT InstructorID FROM CourseOffering WHERE OfferingID = $1', [courseOfferingId]);
    if (offeringResult.rows.length === 0) {
      return res.status(404).send('Course offering not found');
    }
    const isInstructor = offeringResult.rows[0].instructorid === req.user.userId;

    const enrollmentResult = await pool.query('SELECT * FROM Enrollment WHERE OfferingID = $1 AND StudentID = $2', [courseOfferingId, req.user.userId]);
    const isEnrolled = enrollmentResult.rows.length > 0;

    if (!isInstructor && !isEnrolled) {
      return res.status(403).send('You are not authorized to view assignments for this course');
    }

    const { rows } = await pool.query('SELECT * FROM Assignment WHERE OfferingID = $1', [courseOfferingId]);
    res.json(rows);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error fetching assignments');
  }
});

// API endpoint to get a single assignment by ID
app.get('/api/assignments/:assignmentId', authorize(), async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignmentResult = await pool.query('SELECT * FROM Assignment WHERE AssignmentID = $1', [assignmentId]);
    if (assignmentResult.rows.length === 0) {
      return res.status(404).send('Assignment not found');
    }
    const assignment = assignmentResult.rows[0];

    // Verify that the user is either the instructor or enrolled in the course
    const offeringResult = await pool.query('SELECT InstructorID FROM CourseOffering WHERE OfferingID = $1', [assignment.offeringid]);
    const isInstructor = offeringResult.rows[0].instructorid === req.user.userId;

    const enrollmentResult = await pool.query('SELECT * FROM Enrollment WHERE OfferingID = $1 AND StudentID = $2', [assignment.offeringid, req.user.userId]);
    const isEnrolled = enrollmentResult.rows.length > 0;

    if (!isInstructor && !isEnrolled) {
      return res.status(403).send('You are not authorized to view this assignment');
    }

    res.json(assignment);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error fetching assignment');
  }
});

// API endpoint to update an assignment
app.put('/api/assignments/:assignmentId', authorize('Instructor'), async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { Title, Description, MaxPoints, DueDate, WeightPercentage } = req.body;

    // Verify that the instructor is teaching the course for this assignment
    const assignmentResult = await pool.query('SELECT OfferingID FROM Assignment WHERE AssignmentID = $1', [assignmentId]);
    if (assignmentResult.rows.length === 0) {
      return res.status(404).send('Assignment not found');
    }
    const offeringId = assignmentResult.rows[0].offeringid;

    const offeringResult = await pool.query('SELECT InstructorID FROM CourseOffering WHERE OfferingID = $1', [offeringId]);
    if (offeringResult.rows[0].instructorid !== req.user.userId) {
      return res.status(403).send('You are not authorized to update assignments for this course');
    }

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

// API endpoint to delete an assignment
app.delete('/api/assignments/:assignmentId', authorize('Instructor'), async (req, res) => {
  try {
    const { assignmentId } = req.params;

    // Verify that the instructor is teaching the course for this assignment
    const assignmentResult = await pool.query('SELECT OfferingID FROM Assignment WHERE AssignmentID = $1', [assignmentId]);
    if (assignmentResult.rows.length === 0) {
      return res.status(404).send('Assignment not found');
    }
    const offeringId = assignmentResult.rows[0].offeringid;

    const offeringResult = await pool.query('SELECT InstructorID FROM CourseOffering WHERE OfferingID = $1', [offeringId]);
    if (offeringResult.rows[0].instructorid !== req.user.userId) {
      return res.status(403).send('You are not authorized to delete assignments for this course');
    }

    await pool.query('DELETE FROM Assignment WHERE AssignmentID = $1', [assignmentId]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error deleting assignment');
  }
});

// API endpoint to create a quiz for a course offering
app.post('/api/courses/:courseOfferingId/quizzes', authorize('Instructor'), async (req, res) => {
  try {
    const { courseOfferingId } = req.params;
    const { Title, Description, MaxPoints, DueDate, TimeLimit, WeightPercentage } = req.body;

    // Verify that the instructor is teaching this course
    const offeringResult = await pool.query('SELECT InstructorID FROM CourseOffering WHERE OfferingID = $1', [courseOfferingId]);
    if (offeringResult.rows.length === 0) {
      return res.status(404).send('Course offering not found');
    }
    if (offeringResult.rows[0].instructorid !== req.user.userId) {
      return res.status(403).send('You are not authorized to add quizzes to this course');
    }

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

// API endpoint to get all quizzes for a course offering
app.get('/api/courses/:courseOfferingId/quizzes', authorize(), async (req, res) => {
  try {
    const { courseOfferingId } = req.params;

    // Verify that the user is either the instructor or enrolled in the course
    const offeringResult = await pool.query('SELECT InstructorID FROM CourseOffering WHERE OfferingID = $1', [courseOfferingId]);
    if (offeringResult.rows.length === 0) {
      return res.status(404).send('Course offering not found');
    }
    const isInstructor = offeringResult.rows[0].instructorid === req.user.userId;

    const enrollmentResult = await pool.query('SELECT * FROM Enrollment WHERE OfferingID = $1 AND StudentID = $2', [courseOfferingId, req.user.userId]);
    const isEnrolled = enrollmentResult.rows.length > 0;

    if (!isInstructor && !isEnrolled) {
      return res.status(403).send('You are not authorized to view quizzes for this course');
    }

    const { rows } = await pool.query('SELECT * FROM Quiz WHERE OfferingID = $1', [courseOfferingId]);
    res.json(rows);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error fetching quizzes');
  }
});

// API endpoint to get a single quiz by ID
app.get('/api/quizzes/:quizId', authorize(), async (req, res) => {
  try {
    const { quizId } = req.params;
    const quizResult = await pool.query('SELECT * FROM Quiz WHERE QuizID = $1', [quizId]);
    if (quizResult.rows.length === 0) {
      return res.status(404).send('Quiz not found');
    }
    const quiz = quizResult.rows[0];

    // Verify that the user is either the instructor or enrolled in the course
    const offeringResult = await pool.query('SELECT InstructorID FROM CourseOffering WHERE OfferingID = $1', [quiz.offeringid]);
    const isInstructor = offeringResult.rows[0].instructorid === req.user.userId;

    const enrollmentResult = await pool.query('SELECT * FROM Enrollment WHERE OfferingID = $1 AND StudentID = $2', [quiz.offeringid, req.user.userId]);
    const isEnrolled = enrollmentResult.rows.length > 0;

    if (!isInstructor && !isEnrolled) {
      return res.status(403).send('You are not authorized to view this quiz');
    }

    res.json(quiz);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error fetching quiz');
  }
});

// API endpoint to update a quiz
app.put('/api/quizzes/:quizId', authorize('Instructor'), async (req, res) => {
  try {
    const { quizId } = req.params;
    const { Title, Description, MaxPoints, DueDate, TimeLimit, WeightPercentage } = req.body;

    // Verify that the instructor is teaching the course for this quiz
    const quizResult = await pool.query('SELECT OfferingID FROM Quiz WHERE QuizID = $1', [quizId]);
    if (quizResult.rows.length === 0) {
      return res.status(404).send('Quiz not found');
    }
    const offeringId = quizResult.rows[0].offeringid;

    const offeringResult = await pool.query('SELECT InstructorID FROM CourseOffering WHERE OfferingID = $1', [offeringId]);
    if (offeringResult.rows[0].instructorid !== req.user.userId) {
      return res.status(403).send('You are not authorized to update quizzes for this course');
    }

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

// API endpoint to delete a quiz
app.delete('/api/quizzes/:quizId', authorize('Instructor'), async (req, res) => {
  try {
    const { quizId } = req.params;

    // Verify that the instructor is teaching the course for this quiz
    const quizResult = await pool.query('SELECT OfferingID FROM Quiz WHERE QuizID = $1', [quizId]);
    if (quizResult.rows.length === 0) {
      return res.status(404).send('Quiz not found');
    }
    const offeringId = quizResult.rows[0].offeringid;

    const offeringResult = await pool.query('SELECT InstructorID FROM CourseOffering WHERE OfferingID = $1', [offeringId]);
    if (offeringResult.rows[0].instructorid !== req.user.userId) {
      return res.status(403).send('You are not authorized to delete quizzes for this course');
    }

    await pool.query('DELETE FROM Quiz WHERE QuizID = $1', [quizId]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error deleting quiz');
  }
});


// API endpoint to get all users
app.get('/api/users', authorize('Admin'), async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT UserID, FirstName, LastName, Email, Role, DateCreated, LastLogin, IsActive FROM "User"');
    res.json(rows);
  } catch (err) {
    console.error(err.stack);
    res.status(500).send('Error fetching users');
  }
});

// API endpoint to get all courses a user is enrolled in
app.get('/api/users/:userId/courses', authorize(), async (req, res) => {
  try {
    const { userId } = req.params;
    // Ensure the authenticated user can only access their own courses
    if (req.user.userId !== parseInt(userId) && req.user.role !== 'Admin') {
      return res.sendStatus(403);
    }
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

// API endpoint to create a new user
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

// API endpoint to enroll a student in a course
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

// API endpoint for user login
app.post('/api/login', async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const { rows } = await pool.query('SELECT * FROM "User" WHERE Email = $1', [Email]);
    if (rows.length === 0) {
      return res.status(400).send('Invalid email or password');
    }
    const user = rows[0];
    const validPassword = await bcrypt.compare(Password, user.passwordhash);
    if (!validPassword) {
      return res.status(400).send('Invalid email or password');
    }
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
