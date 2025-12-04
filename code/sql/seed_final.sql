--
-- PostgreSQL database seed data for Final Project Submission
-- This script populates the database with a larger, more comprehensive dataset.
--

-- Insert Users (25 records)
-- 5 Instructors, 20 Students
-- Password for all users is 'password' (hashed: $2b$10$MqxcwXvQi3Jv1OR3DiV/9ezWIhFGRk1HBndtFbpZbkwG6mIbvZ12e)
INSERT INTO "User" (FirstName, LastName, Email, PasswordHash, Role) VALUES
('Michael', 'Johnson', 'michael.johnson@university.edu', '$2b$10$MqxcwXvQi3Jv1OR3DiV/9ezWIhFGRk1HBndtFbpZbkwG6mIbvZ12e', 'Instructor'),
('Emily', 'Williams', 'emily.williams@university.edu', '$2b$10$MqxcwXvQi3Jv1OR3DiV/9ezWIhFGRk1HBndtFbpZbkwG6mIbvZ12e', 'Instructor'),
('Daniel', 'Brown', 'daniel.brown@university.edu', '$2b$10$MqxcwXvQi3Jv1OR3DiV/9ezWIhFGRk1HBndtFbpZbkwG6mIbvZ12e', 'Instructor'),
('Jessica', 'Jones', 'jessica.jones@university.edu', '$2b$10$MqxcwXvQi3Jv1OR3DiV/9ezWIhFGRk1HBndtFbpZbkwG6mIbvZ12e', 'Instructor'),
('David', 'Miller', 'david.miller@university.edu', '$2b$10$MqxcwXvQi3Jv1OR3DiV/9ezWIhFGRk1HBndtFbpZbkwG6mIbvZ12e', 'Instructor'),
('Sarah', 'Davis', 'sarah.davis@student.university.edu', '$2b$10$MqxcwXvQi3Jv1OR3DiV/9ezWIhFGRk1HBndtFbpZbkwG6mIbvZ12e', 'Student'),
('Christopher', 'Garcia', 'christopher.garcia@student.university.edu', '$2b$10$MqxcwXvQi3Jv1OR3DiV/9ezWIhFGRk1HBndtFbpZbkwG6mIbvZ12e', 'Student'),
('Ashley', 'Rodriguez', 'ashley.rodriguez@student.university.edu', '$2b$10$MqxcwXvQi3Jv1OR3DiV/9ezWIhFGRk1HBndtFbpZbkwG6mIbvZ12e', 'Student'),
('Matthew', 'Wilson', 'matthew.wilson@student.university.edu', '$2b$10$MqxcwXvQi3Jv1OR3DiV/9ezWIhFGRk1HBndtFbpZbkwG6mIbvZ12e', 'Student'),
('Amanda', 'Martinez', 'amanda.martinez@student.university.edu', '$2b$10$MqxcwXvQi3Jv1OR3DiV/9ezWIhFGRk1HBndtFbpZbkwG6mIbvZ12e', 'Student'),
('Joshua', 'Anderson', 'joshua.anderson@student.university.edu', '$2b$10$MqxcwXvQi3Jv1OR3DiV/9ezWIhFGRk1HBndtFbpZbkwG6mIbvZ12e', 'Student'),
('Megan', 'Taylor', 'megan.taylor@student.university.edu', '$2b$10$MqxcwXvQi3Jv1OR3DiV/9ezWIhFGRk1HBndtFbpZbkwG6mIbvZ12e', 'Student'),
('Andrew', 'Thomas', 'andrew.thomas@student.university.edu', '$2b$10$MqxcwXvQi3Jv1OR3DiV/9ezWIhFGRk1HBndtFbpZbkwG6mIbvZ12e', 'Student'),
('Jennifer', 'Hernandez', 'jennifer.hernandez@student.university.edu', '$2b$10$MqxcwXvQi3Jv1OR3DiV/9ezWIhFGRk1HBndtFbpZbkwG6mIbvZ12e', 'Student'),
('James', 'Moore', 'james.moore@student.university.edu', '$2b$10$MqxcwXvQi3Jv1OR3DiV/9ezWIhFGRk1HBndtFbpZbkwG6mIbvZ12e', 'Student'),
('Elizabeth', 'Martin', 'elizabeth.martin@student.university.edu', '$2b$10$MqxcwXvQi3Jv1OR3DiV/9ezWIhFGRk1HBndtFbpZbkwG6mIbvZ12e', 'Student'),
('Robert', 'Jackson', 'robert.jackson@student.university.edu', '$2b$10$MqxcwXvQi3Jv1OR3DiV/9ezWIhFGRk1HBndtFbpZbkwG6mIbvZ12e', 'Student'),
('Linda', 'Thompson', 'linda.thompson@student.university.edu', '$2b$10$MqxcwXvQi3Jv1OR3DiV/9ezWIhFGRk1HBndtFbpZbkwG6mIbvZ12e', 'Student'),
('William', 'White', 'william.white@student.university.edu', '$2b$10$MqxcwXvQi3Jv1OR3DiV/9ezWIhFGRk1HBndtFbpZbkwG6mIbvZ12e', 'Student'),
('Patricia', 'Harris', 'patricia.harris@student.university.edu', '$2b$10$MqxcwXvQi3Jv1OR3DiV/9ezWIhFGRk1HBndtFbpZbkwG6mIbvZ12e', 'Student'),
('Admin', 'User', 'admin@lms.com', '$2b$10$MqxcwXvQi3Jv1OR3DiV/9ezWIhFGRk1HBndtFbpZbkwG6mIbvZ12e', 'Admin');

-- Insert Terms (5 records)
INSERT INTO Term (TermName, TermType, StartDate, EndDate) VALUES
('Fall 2024', 'Fall', '2024-08-26', '2024-12-13'),
('Spring 2025', 'Spring', '2025-01-13', '2025-05-09'),
('Fall 2025', 'Fall', '2025-08-25', '2025-12-12'),
('Spring 2026', 'Spring', '2026-01-12', '2026-05-08'),
('Summer 2026', 'Summer', '2026-05-18', '2026-08-07');

-- Insert Courses (6 records)
INSERT INTO Course (CourseCode, CourseName, Description, CreditHours, Department) VALUES
('CS101', 'Introduction to Computer Science', 'A foundational course on the principles of computer science.', 3.0, 'Computer Science'),
('MATH203', 'Calculus III', 'Advanced topics in calculus, including multi-variable calculus.', 4.0, 'Mathematics'),
('PHYS101', 'General Physics I', 'An introduction to classical mechanics.', 4.0, 'Physics'),
('ENGL220', 'British Literature', 'A survey of major British writers from the medieval period to the 20th century.', 3.0, 'English'),
('HIST301', 'American History: 1865 to Present', 'A study of the United States from the end of the Civil War to modern times.', 3.0, 'History'),
('ART100', 'Introduction to Art History', 'A survey of Western art from the ancient world to the present.', 3.0, 'Art History');

-- Insert Course Offerings (20 records)
-- Insert Course Offerings (18 records)
INSERT INTO CourseOffering (CourseID, TermID, InstructorID, SectionNumber, MaxEnrollment) VALUES
(1, 1, 1, '001', 50), (1, 2, 2, '001', 50), (1, 3, 1, '001', 60), (1, 4, 2, '002', 60),
(2, 1, 3, 'A', 35), (2, 2, 3, 'A', 40), (2, 3, 4, 'B', 40), (2, 4, 4, 'B', 40),
(3, 1, 5, 'S1', 70), (3, 2, 5, 'S1', 75), (3, 3, 1, 'S2', 75),
(4, 2, 2, 'L1', 30), (4, 3, 2, 'L1', 30), (4, 4, 3, 'L2', 35),
(5, 1, 4, 'H1', 45), (5, 3, 4, 'H1', 50),
(6, 2, 5, 'AH1', 80), (6, 4, 5, 'AH1', 80);

-- Insert Enrollments (at least 20 records)
-- Enrolling students 6-25 into various course offerings
INSERT INTO Enrollment (StudentID, OfferingID) VALUES
(6, 1), (7, 1), (8, 1), (9, 1), (10, 1),
(11, 2), (12, 2), (13, 2), (14, 2), (15, 2),
(16, 5), (17, 5), (18, 5), (19, 5), (20, 5),
(6, 6), (7, 7), (8, 8), (9, 9), (10, 10),
(11, 11), (12, 12), (13, 13), (14, 14), (15, 15);

-- Insert Assignments (20 records)
INSERT INTO Assignment (OfferingID, Title, Description, MaxPoints, DueDate, WeightPercentage) VALUES
(1, 'CS101 HW1', 'Hello World program.', 100, '2024-09-10', 10),
(1, 'CS101 HW2', 'Variables and Data Types.', 100, '2024-09-24', 10),
(2, 'CS101 HW3', 'Control Flow.', 100, '2025-02-15', 15),
(3, 'CS101 Midterm Project', 'Build a simple calculator.', 200, '2025-10-20', 25),
(3, 'CS101 Final Project', 'Build a text-based adventure game.', 300, '2025-12-05', 35),
(5, 'MATH203 HW1', 'Vectors and the Geometry of Space.', 100, '2024-09-12', 5),
(5, 'MATH203 HW2', 'Vector Functions.', 100, '2024-09-26', 5),
(6, 'MATH203 Exam 1', 'Midterm exam covering chapters 12-13.', 150, '2025-03-01', 20),
(7, 'MATH203 HW3', 'Partial Derivatives.', 100, '2025-10-15', 5),
(8, 'MATH203 Final Exam', 'Comprehensive final exam.', 250, '2026-05-01', 30),
(9, 'PHYS101 Lab 1', 'Measurement and Error Analysis.', 50, '2024-09-05', 5),
(9, 'PHYS101 Lab 2', 'Kinematics.', 50, '2024-09-19', 5),
(10, 'PHYS101 Midterm 1', 'Covering chapters 1-5.', 100, '2025-03-10', 20),
(11, 'PHYS101 Lab 3', 'Newtons Laws.', 50, '2025-10-02', 5),
(12, 'ENGL220 Essay 1', 'Analysis of Beowulf.', 100, '2025-02-20', 25),
(12, 'ENGL220 Essay 2', 'Shakespearean Sonnet Analysis.', 100, '2025-04-10', 25),
(14, 'HIST301 Research Paper Proposal', 'Submit a topic and preliminary bibliography.', 50, '2026-02-28', 10),
(15, 'HIST301 Midterm Exam', 'Exam covering Reconstruction to WWII.', 100, '2024-10-25', 30),
(16, 'ART100 Museum Visit Report', 'Report on a visit to a local art museum.', 100, '2025-11-15', 20),
(17, 'ART100 Final Paper', 'Research paper on a Renaissance artist.', 150, '2026-04-20', 30);

-- Insert Submissions (20 records)
-- Students 6-15 submitting to various assignments
INSERT INTO Submission (AssignmentID, StudentID, FileURL, IsLate, VersionNumber, Score) VALUES
(1, 6, '/sub/cs101_hw1_s6.zip', false, 1, 95),
(1, 7, '/sub/cs101_hw1_s7.zip', false, 1, 88),
(2, 6, '/sub/cs101_hw2_s6.zip', false, 1, 92),
(2, 8, '/sub/cs101_hw2_s8.zip', true, 2, 75),
(4, 9, '/sub/cs101_midterm_s9.zip', false, 1, 180),
(4, 10, '/sub/cs101_midterm_s10.zip', false, 1, 165),
(6, 16, '/sub/math203_hw1_s16.pdf', false, 1, 100),
(6, 17, '/sub/math203_hw1_s17.pdf', false, 1, 94),
(7, 18, '/sub/math203_hw2_s18.pdf', false, 1, 85),
(9, 19, '/sub/math203_hw3_s19.pdf', true, 1, 80),
(11, 6, '/sub/phys101_lab1_s6.pdf', false, 1, 45),
(11, 7, '/sub/phys101_lab1_s7.pdf', false, 1, 48),
(12, 11, '/sub/phys101_lab2_s11.pdf', false, 1, 50),
(15, 12, '/sub/engl220_essay1_s12.docx', false, 1, 82),
(15, 13, '/sub/engl220_essay1_s13.docx', false, 1, 91),
(16, 14, '/sub/engl220_essay2_s14.docx', true, 1, 78),
(17, 15, '/sub/hist301_proposal_s15.pdf', false, 1, 45),
(18, 16, '/sub/hist301_midterm_s16.pdf', false, 1, 88),
(19, 17, '/sub/art100_report_s17.docx', false, 1, 92),
(20, 18, '/sub/art100_paper_s18.docx', false, 1, 135);
