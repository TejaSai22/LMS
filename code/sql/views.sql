--
-- Database Views
-- Simplifies complex queries for application use
--

-- 1. Student Transcript View
-- Shows a student's history of courses, terms, and final grades
CREATE OR REPLACE VIEW v_StudentTranscript AS
SELECT
    u.UserID AS StudentID,
    u.FirstName,
    u.LastName,
    c.CourseCode,
    c.CourseName,
    t.TermName,
    g.NumericGrade,
    g.LetterGrade,
    c.CreditHours
FROM
    "User" u
JOIN Enrollment e ON u.UserID = e.StudentID
JOIN CourseOffering co ON e.OfferingID = co.OfferingID
JOIN Course c ON co.CourseID = c.CourseID
JOIN Term t ON co.TermID = t.TermID
LEFT JOIN Grade g ON e.EnrollmentID = g.EnrollmentID
WHERE
    u.Role = 'Student';

-- 2. Course Performance View
-- Aggregates assignment scores to show average performance per course offering
CREATE OR REPLACE VIEW v_CoursePerformance AS
SELECT
    c.CourseCode,
    c.CourseName,
    t.TermName,
    co.SectionNumber,
    u.LastName AS InstructorName,
    COUNT(DISTINCT e.StudentID) AS EnrolledStudents,
    AVG(s.Score) AS AverageAssignmentScore
FROM
    CourseOffering co
JOIN Course c ON co.CourseID = c.CourseID
JOIN Term t ON co.TermID = t.TermID
JOIN "User" u ON co.InstructorID = u.UserID
LEFT JOIN Enrollment e ON co.OfferingID = e.OfferingID
LEFT JOIN Assignment a ON co.OfferingID = a.OfferingID
LEFT JOIN Submission s ON a.AssignmentID = s.AssignmentID
GROUP BY
    c.CourseCode, c.CourseName, t.TermName, co.SectionNumber, u.LastName;

-- 3. Instructor Load View
-- Shows how many courses and students each instructor is managing in active terms
CREATE OR REPLACE VIEW v_InstructorLoad AS
SELECT
    u.UserID AS InstructorID,
    u.FirstName,
    u.LastName,
    t.TermName,
    COUNT(DISTINCT co.OfferingID) AS CoursesTaught,
    SUM(co.CurrentEnrollment) AS TotalStudents
FROM
    "User" u
JOIN CourseOffering co ON u.UserID = co.InstructorID
JOIN Term t ON co.TermID = t.TermID
WHERE
    u.Role = 'Instructor'
    AND t.IsActive = TRUE
GROUP BY
    u.UserID, u.FirstName, u.LastName, t.TermName;
