-- Final Project Report Queries
-- Group 18

-- 1. Average Assignment Scores per Course (with Individual Scores)
SELECT
    a.Title AS AssignmentTitle,
    s.Score AS IndividualScore,
    AVG(s.Score) OVER (
        PARTITION BY
            a.AssignmentID
    ) AS AverageScore,
    a.MaxPoints
FROM Submission s
    JOIN Assignment a ON s.AssignmentID = a.AssignmentID
WHERE
    a.OfferingID = 1;

-- 2. Late Submission Analysis (with Days Late)
SELECT
    u.FirstName,
    u.LastName,
    c.CourseName,
    a.Title AS AssignmentTitle,
    s.SubmissionDate,
    a.DueDate,
    EXTRACT(
        DAY
        FROM (s.SubmissionDate - a.DueDate)
    ) AS DaysLate
FROM
    "User" u
    JOIN Submission s ON u.UserID = s.StudentID
    JOIN Assignment a ON s.AssignmentID = a.AssignmentID
    JOIN CourseOffering co ON a.OfferingID = co.OfferingID
    JOIN Course c ON co.CourseID = c.CourseID
WHERE
    s.IsLate = TRUE;

-- 3. Instructor Teaching Load
SELECT c.CourseName, co.SectionNumber, COUNT(e.StudentID) AS NumberOfStudents
FROM
    Course c
    JOIN CourseOffering co ON c.CourseID = co.CourseID
    JOIN Term t ON co.TermID = t.TermID
    LEFT JOIN Enrollment e ON co.OfferingID = e.OfferingID
WHERE
    co.InstructorID = 1
    AND t.TermName = 'Fall 2024'
GROUP BY
    c.CourseName,
    co.SectionNumber;

-- 4. Top Performing Students
SELECT u.FirstName, u.LastName, c.CourseName, AVG(s.Score) AS AverageScore, AVG(a.MaxPoints) AS OutOf
FROM
    "User" u
    JOIN Submission s ON u.UserID = s.StudentID
    JOIN Assignment a ON s.AssignmentID = a.AssignmentID
    JOIN CourseOffering co ON a.OfferingID = co.OfferingID
    JOIN Course c ON co.CourseID = c.CourseID
WHERE
    s.Score IS NOT NULL
GROUP BY
    u.FirstName,
    u.LastName,
    c.CourseName
ORDER BY AverageScore DESC
LIMIT 5;

-- 5. Ungraded Assignments
SELECT c.CourseName, COUNT(s.SubmissionID) AS UngradedCount
FROM
    Submission s
    JOIN Assignment a ON s.AssignmentID = a.AssignmentID
    JOIN CourseOffering co ON a.OfferingID = co.OfferingID
    JOIN Course c ON co.CourseID = c.CourseID
WHERE
    s.Score IS NULL
GROUP BY
    c.CourseName;