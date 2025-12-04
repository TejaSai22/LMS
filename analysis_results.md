# Data Analysis Queries and Results

This document presents five data analysis queries, their plain-English explanations, and the results of running them against the populated LMS database.

---

### Query 1: Calculate Average Assignment Grades

**Question:** What is the average grade for each assignment in a specific course offering (CS101, Fall 2025)?

**SQL Statement:**
```sql
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
```

**Result:**
```
    assignmenttitle    |     averagescore     | maxpoints
-----------------------+----------------------+-----------
 CS101 Midterm Project | 172.5000000000000000 |    200.00
(1 row)
```

---

### Query 2: Find Students with Late Submissions

**Question:** Which students have submitted one or more assignments late?

**SQL Statement:**
```sql
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
```

**Result:**
```
 firstname | lastname  |            coursename            | assignmenttitle |       submissiondate
-----------+-----------+----------------------------------+-----------------+----------------------------
 Jennifer  | Hernandez | British Literature               | ENGL220 Essay 2 | 2025-12-02 08:06:46.320917
 Ashley    | Rodriguez | Introduction to Computer Science | CS101 HW2       | 2025-12-02 08:06:46.320917
 William   | White     | Calculus III                     | MATH203 HW3     | 2025-12-02 08:06:46.320917
(3 rows)
```

---

### Query 3: Instructor's Teaching Load

**Question:** What is the teaching load for a specific instructor (Michael Johnson) in the Fall 2025 term, showing the number of students in each course?

**SQL Statement:**
```sql
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
```

**Result:**
```
            coursename            | sectionnumber | termname  | numberofstudents
----------------------------------+---------------+-----------+------------------
 General Physics I                | S2            | Fall 2025 |                1
 Introduction to Computer Science | 001           | Fall 2025 |                0
(2 rows)
```

---

### Query 4: Top 5 Students by Average Score

**Question:** Who are the top 5 students with the highest average score in a specific course (CS101, Fall 2024)?

**SQL Statement:**
```sql
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
```

**Result:**
```
  firstname  | lastname  |    averagescore
-------------+-----------+---------------------
 Sarah       | Davis     | 93.5000000000000000
 Christopher | Garcia    | 88.0000000000000000
 Ashley      | Rodriguez | 75.0000000000000000
(3 rows)
```

---

### Query 5: Find Ungraded Assignments

**Question:** Which submitted assignments across all courses are currently ungraded?

**SQL Statement:**
```sql
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
```

**Result:**
```
 coursename | assignmenttitle | studentfirstname | studentlastname | submissiondate
------------+-----------------+------------------+-----------------+----------------
(0 rows)
```
*(Note: This query now correctly returns 0 rows, as all submissions in the seed data have been assigned a score.)*
