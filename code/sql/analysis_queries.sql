-- Query 1: Calculate the average grade for each assignment in a specific course offering.
-- This query helps instructors understand the overall performance of students on different assignments.
SELECT
    a.Title AS AssignmentTitle,
    AVG(s.Score) AS AverageScore,
    a.MaxPoints
FROM
    Submission s
JOIN
    Assignment a ON s.AssignmentID = a.AssignmentID
WHERE
    a.OfferingID = 3 -- Specific course offering (CS101, Fall 2025)
GROUP BY
    a.Title, a.MaxPoints
ORDER BY
    AverageScore DESC;

-- Query 2: Find all students who have submitted assignments late.
-- This query is useful for identifying students who may be struggling with deadlines.
SELECT
    u.FirstName,
    u.LastName,
    c.CourseName,
    a.Title AS AssignmentTitle,
    s.SubmissionDate
FROM
    "User" u
JOIN
    Submission s ON u.UserID = s.StudentID
JOIN
    Assignment a ON s.AssignmentID = a.AssignmentID
JOIN
    CourseOffering co ON a.OfferingID = co.OfferingID
JOIN
    Course c ON co.CourseID = c.CourseID
WHERE
    s.IsLate = TRUE
ORDER BY
    u.LastName, u.FirstName, c.CourseName;

-- Query 3: List all courses an instructor is teaching in a given term and the number of students enrolled in each.
-- This provides an overview of an instructor's teaching load for a specific term.
SELECT
    c.CourseName,
    co.SectionNumber,
    t.TermName,
    COUNT(e.StudentID) AS NumberOfStudents
FROM
    Course c
JOIN
    CourseOffering co ON c.CourseID = co.CourseID
JOIN
    Term t ON co.TermID = t.TermID
LEFT JOIN
    Enrollment e ON co.OfferingID = e.OfferingID
WHERE
    co.InstructorID = 1 -- Specific instructor (Michael Johnson)
    AND t.TermName = 'Fall 2025'
GROUP BY
    c.CourseName, co.SectionNumber, t.TermName
ORDER BY
    c.CourseName;

-- Query 4: Get the top 5 students with the highest average score in a specific course.
-- This helps identify high-performing students in a particular course.
SELECT
    u.FirstName,
    u.LastName,
    AVG(s.Score) AS AverageScore
FROM
    "User" u
JOIN
    Submission s ON u.UserID = s.StudentID
JOIN
    Assignment a ON s.AssignmentID = a.AssignmentID
WHERE
    a.OfferingID = 1 -- Specific course offering (CS101, Fall 2024)
GROUP BY
    u.FirstName, u.LastName
ORDER BY
    AverageScore DESC
LIMIT 5;

-- Query 5: Find all assignments that have not yet been graded.
-- This query is a to-do list for instructors, showing them which submissions need grading.
SELECT
    c.CourseName,
    a.Title AS AssignmentTitle,
    u.FirstName AS StudentFirstName,
    u.LastName AS StudentLastName,
    s.SubmissionDate
FROM
    Submission s
JOIN
    Assignment a ON s.AssignmentID = a.AssignmentID
JOIN
    CourseOffering co ON a.OfferingID = co.OfferingID
JOIN
    Course c ON co.CourseID = c.CourseID
JOIN
    "User" u ON s.StudentID = u.UserID
WHERE
    s.Score IS NULL
ORDER BY
    c.CourseName, a.Title, s.SubmissionDate;
