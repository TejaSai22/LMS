SELECT 'User' as TableName, COUNT(*) as Count
FROM "User"
UNION ALL
SELECT 'Course', COUNT(*)
FROM Course
UNION ALL
SELECT 'Term', COUNT(*)
FROM Term
UNION ALL
SELECT 'CourseOffering', COUNT(*)
FROM CourseOffering
UNION ALL
SELECT 'Enrollment', COUNT(*)
FROM Enrollment
UNION ALL
SELECT 'Assignment', COUNT(*)
FROM Assignment
UNION ALL
SELECT 'Submission', COUNT(*)
FROM Submission
UNION ALL
SELECT 'Quiz', COUNT(*)
FROM Quiz
UNION ALL
SELECT 'QuizAttempt', COUNT(*)
FROM QuizAttempt
UNION ALL
SELECT 'Module', COUNT(*)
FROM Module
UNION ALL
SELECT 'Material', COUNT(*)
FROM Material
UNION ALL
SELECT 'Grade', COUNT(*)
FROM Grade
UNION ALL
SELECT 'CoursePrerequisite', COUNT(*)
FROM CoursePrerequisite;