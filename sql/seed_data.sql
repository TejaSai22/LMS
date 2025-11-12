--
-- PostgreSQL database seed data
--

-- Insert Users
-- Password for all users is 'password' (hashed)
INSERT INTO "User" (FirstName, LastName, Email, PasswordHash, Role) VALUES
('Admin', 'User', 'admin@lms.com', '$2b$10$MqxcwXvQi3Jv1OR3DiV/9ezWIhFGRk1HBndtFbpZbkwG6mIbvZ12e', 'Admin'),
('John', 'Doe', 'john.doe@example.com', '$2b$10$MqxcwXvQi3Jv1OR3DiV/9ezWIhFGRk1HBndtFbpZbkwG6mIbvZ12e', 'Student'),
('Jane', 'Smith', 'jane.smith@example.com', '$2b$10$MqxcwXvQi3Jv1OR3DiV/9ezWIhFGRk1HBndtFbpZbkwG6mIbvZ12e', 'Student'),
('Peter', 'Jones', 'peter.jones@example.com', '$2b$10$MqxcwXvQi3Jv1OR3DiV/9ezWIhFGRk1HBndtFbpZbkwG6mIbvZ12e', 'Instructor');

-- Insert Terms
INSERT INTO Term (TermName, TermType, StartDate, EndDate) VALUES
('Fall 2025', 'Fall', '2025-08-25', '2025-12-12'),
('Spring 2026', 'Spring', '2026-01-12', '2026-05-08');

-- Insert Courses
INSERT INTO Course (CourseCode, CourseName, Description, CreditHours, Department) VALUES
('CS101', 'Introduction to Computer Science', 'A foundational course on the principles of computer science.', 3.0, 'Computer Science'),
('MATH203', 'Calculus III', 'Advanced topics in calculus, including multi-variable calculus.', 4.0, 'Mathematics');

-- Insert Course Offerings
-- John Doe is the instructor for both offerings
INSERT INTO CourseOffering (CourseID, TermID, InstructorID, SectionNumber, MaxEnrollment) VALUES
((SELECT CourseID FROM Course WHERE CourseCode = 'CS101'), (SELECT TermID FROM Term WHERE TermName = 'Fall 2025'), (SELECT UserID FROM "User" WHERE Email = 'peter.jones@example.com'), '001', 50),
((SELECT CourseID FROM Course WHERE CourseCode = 'MATH203'), (SELECT TermID FROM Term WHERE TermName = 'Fall 2025'), (SELECT UserID FROM "User" WHERE Email = 'peter.jones@example.com'), 'A', 35);

-- Insert Enrollments
-- John Doe is enrolled in CS101
INSERT INTO Enrollment (StudentID, OfferingID) VALUES
((SELECT UserID FROM "User" WHERE Email = 'john.doe@example.com'), (SELECT OfferingID FROM CourseOffering WHERE CourseID = (SELECT CourseID FROM Course WHERE CourseCode = 'CS101') AND TermID = (SELECT TermID FROM Term WHERE TermName = 'Fall 2025'))),
-- Jane Smith is enrolled in both courses
((SELECT UserID FROM "User" WHERE Email = 'jane.smith@example.com'), (SELECT OfferingID FROM CourseOffering WHERE CourseID = (SELECT CourseID FROM Course WHERE CourseCode = 'CS101') AND TermID = (SELECT TermID FROM Term WHERE TermName = 'Fall 2025'))),
((SELECT UserID FROM "User" WHERE Email = 'jane.smith@example.com'), (SELECT OfferingID FROM CourseOffering WHERE CourseID = (SELECT CourseID FROM Course WHERE CourseCode = 'MATH203') AND TermID = (SELECT TermID FROM Term WHERE TermName = 'Fall 2025')));

-- Insert Assignments for CS101
INSERT INTO Assignment (OfferingID, Title, Description, MaxPoints, DueDate, WeightPercentage) VALUES
((SELECT OfferingID FROM CourseOffering WHERE CourseID = (SELECT CourseID FROM Course WHERE CourseCode = 'CS101') AND TermID = (SELECT TermID FROM Term WHERE TermName = 'Fall 2025')), 'Assignment 1: Hello World', 'Write a simple "Hello, World!" program in Python.', 100, '2025-09-15 23:59:59', 20.00);

-- Insert Quizzes for CS101
INSERT INTO Quiz (OfferingID, Title, Description, MaxPoints, DueDate, TimeLimit, WeightPercentage) VALUES
((SELECT OfferingID FROM CourseOffering WHERE CourseID = (SELECT CourseID FROM Course WHERE CourseCode = 'CS101') AND TermID = (SELECT TermID FROM Term WHERE TermName = 'Fall 2025')), 'Quiz 1: Basic Concepts', 'A short quiz on the basic concepts of programming.', 50, '2025-09-22 23:59:59', 30, 10.00);
