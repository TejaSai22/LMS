--
-- Extended Seed Data
-- Populates Quiz, QuizAttempt, Module, Material, and Grade tables
-- Assumes seed_final.sql has already been run
--

-- 1. Insert Modules (Organizing content for CourseOfferings)
-- For CS101 (Offering 1)
INSERT INTO
    Module (
        OfferingID,
        ModuleName,
        Description,
        SequenceNumber,
        StartDate
    )
VALUES (
        1,
        'Module 1: Introduction to Programming',
        'Basic concepts and setup',
        1,
        '2024-08-26'
    ),
    (
        1,
        'Module 2: Variables and Data Types',
        'Understanding storage and types',
        2,
        '2024-09-02'
    ),
    (
        1,
        'Module 3: Control Flow',
        'If statements and loops',
        3,
        '2024-09-16'
    );

-- For MATH203 (Offering 5)
INSERT INTO
    Module (
        OfferingID,
        ModuleName,
        Description,
        SequenceNumber,
        StartDate
    )
VALUES (
        5,
        'Module 1: Vectors',
        'Introduction to vectors in 3D',
        1,
        '2024-08-26'
    ),
    (
        5,
        'Module 2: Partial Derivatives',
        'Calculus of multiple variables',
        2,
        '2024-09-15'
    );

-- 2. Insert Materials (Content for Modules)
-- CS101 Materials
INSERT INTO
    Material (
        ModuleID,
        Title,
        ContentType,
        FileURL,
        SequenceNumber
    )
VALUES (
        1,
        'Syllabus',
        'PDF',
        '/content/cs101/syllabus.pdf',
        1
    ),
    (
        1,
        'Lecture 1 Slides',
        'Document',
        '/content/cs101/lecture1.pptx',
        2
    ),
    (
        1,
        'Setup Guide',
        'Link',
        'https://docs.python.org/3/tutorial/',
        3
    ),
    (
        2,
        'Lecture 2 Slides',
        'Document',
        '/content/cs101/lecture2.pptx',
        1
    ),
    (
        2,
        'Variable Cheatsheet',
        'Image',
        '/content/cs101/variables.png',
        2
    );

-- MATH203 Materials
INSERT INTO
    Material (
        ModuleID,
        Title,
        ContentType,
        FileURL,
        SequenceNumber
    )
VALUES (
        4,
        'Vector Properties',
        'PDF',
        '/content/math203/vectors.pdf',
        1
    ),
    (
        4,
        '3D Graphing Tool',
        'Link',
        'https://www.geogebra.org/3d',
        2
    );

-- 3. Insert Quizzes
-- CS101 Quiz
INSERT INTO
    Quiz (
        OfferingID,
        Title,
        Description,
        MaxPoints,
        DueDate,
        TimeLimit,
        WeightPercentage
    )
VALUES (
        1,
        'CS101 Quiz 1',
        'Basics of Python',
        50,
        '2024-09-20 23:59:59',
        60,
        10.00
    ),
    (
        1,
        'CS101 Quiz 2',
        'Control Flow',
        50,
        '2024-10-05 23:59:59',
        45,
        10.00
    ),
    (
        1,
        'CS101 Quiz 3',
        'Functions',
        50,
        '2024-10-20 23:59:59',
        45,
        10.00
    );

-- MATH203 Quiz
INSERT INTO
    Quiz (
        OfferingID,
        Title,
        Description,
        MaxPoints,
        DueDate,
        TimeLimit,
        WeightPercentage
    )
VALUES (
        5,
        'MATH203 Quiz 1',
        'Vector Operations',
        50,
        '2024-09-30 23:59:59',
        45,
        10.00
    ),
    (
        5,
        'MATH203 Quiz 2',
        '3D Geometry',
        50,
        '2024-10-15 23:59:59',
        60,
        10.00
    );

-- 4. Insert Quiz Attempts
-- Students 6, 7, 8 taking CS101 Quiz 1 (QuizID 1)
INSERT INTO
    QuizAttempt (
        QuizID,
        StudentID,
        AttemptNumber,
        StartTime,
        SubmitTime,
        Score,
        IsCompleted
    )
VALUES (
        1,
        6,
        1,
        '2024-09-19 10:00:00',
        '2024-09-19 10:45:00',
        48.50,
        TRUE
    ),
    (
        1,
        7,
        1,
        '2024-09-19 14:00:00',
        '2024-09-19 14:50:00',
        42.00,
        TRUE
    ),
    (
        1,
        8,
        1,
        '2024-09-20 20:00:00',
        '2024-09-20 20:55:00',
        35.00,
        TRUE
    );

-- Students 16, 17 taking MATH203 Quiz 1 (QuizID 4 - assuming auto-inc)
-- Note: QuizIDs will be 1, 2, 3 (CS101) and 4, 5 (MATH203) based on insertion order
INSERT INTO
    QuizAttempt (
        QuizID,
        StudentID,
        AttemptNumber,
        StartTime,
        SubmitTime,
        Score,
        IsCompleted
    )
VALUES (
        4,
        16,
        1,
        '2024-09-29 09:00:00',
        '2024-09-29 09:40:00',
        50.00,
        TRUE
    ),
    (
        4,
        17,
        1,
        '2024-09-30 11:00:00',
        '2024-09-30 11:42:00',
        45.00,
        TRUE
    ),
    (
        2,
        6,
        1,
        '2024-10-04 10:00:00',
        '2024-10-04 10:40:00',
        45.00,
        TRUE
    ),
    (
        2,
        7,
        1,
        '2024-10-04 14:00:00',
        '2024-10-04 14:45:00',
        48.00,
        TRUE
    );

-- 5. Insert Grades (Final Grades for completed enrollments)
-- Assuming some enrollments are complete for demonstration, though dates in seed_final are current/future.
-- We will insert grades for the enrollments we created in seed_final.sql
-- Enrollment IDs are auto-increment, so we need to be careful.
-- Based on seed_final.sql, we have ~25 enrollments. Let's grade the first few.

-- Grade for Student 6 in CS101 (EnrollmentID likely 1)
INSERT INTO
    Grade (
        EnrollmentID,
        NumericGrade,
        LetterGrade,
        GradeDate,
        Comments
    )
VALUES (
        1,
        94.50,
        'A',
        '2024-12-15 10:00:00',
        'Excellent performance throughout the semester.'
    );

-- Grade for Student 7 in CS101 (EnrollmentID likely 2)
INSERT INTO
    Grade (
        EnrollmentID,
        NumericGrade,
        LetterGrade,
        GradeDate,
        Comments
    )
VALUES (
        2,
        88.00,
        'B+',
        '2024-12-15 10:05:00',
        'Good work, but missed a few concepts in the final.'
    );

-- Grade for Student 8 in CS101 (EnrollmentID likely 3)
INSERT INTO
    Grade (
        EnrollmentID,
        NumericGrade,
        LetterGrade,
        GradeDate,
        Comments
    )
VALUES (
        3,
        78.00,
        'C+',
        '2024-12-15 10:10:00',
        'Satisfactory work.'
    );

-- Grade for Student 16 in MATH203 (EnrollmentID likely 11)
INSERT INTO
    Grade (
        EnrollmentID,
        NumericGrade,
        LetterGrade,
        GradeDate,
        Comments
    )
VALUES (
        11,
        98.00,
        'A+',
        '2024-12-16 09:00:00',
        'Outstanding understanding of the material.'
    );

-- Grade for Student 17 in MATH203 (EnrollmentID likely 12)
INSERT INTO
    Grade (
        EnrollmentID,
        NumericGrade,
        LetterGrade,
        GradeDate,
        Comments
    )
VALUES (
        12,
        85.00,
        'B',
        '2024-12-16 09:05:00',
        'Good effort.'
    );

-- Seed Prerequisites
INSERT INTO
    CoursePrerequisite (CourseID, PrereqCourseID)
VALUES (2, 1), -- Intro to CS is prerequisite for Data Structures
    (3, 1), -- Intro to CS is prerequisite for Database Systems
    (4, 2), -- Data Structures is prerequisite for Web Development
    (5, 3);
-- Database Systems is prerequisite for Algorithms

-- 6. Insert Additional Courses to meet 20-record requirement
INSERT INTO
    Course (
        CourseCode,
        CourseName,
        Description,
        CreditHours,
        Department
    )
VALUES (
        'BIO101',
        'General Biology',
        'Introduction to biology.',
        4.0,
        'Biology'
    ),
    (
        'CHEM101',
        'General Chemistry',
        'Introduction to chemistry.',
        4.0,
        'Chemistry'
    ),
    (
        'PSY101',
        'Intro to Psychology',
        'Basics of psychology.',
        3.0,
        'Psychology'
    ),
    (
        'SOC101',
        'Intro to Sociology',
        'Basics of sociology.',
        3.0,
        'Sociology'
    ),
    (
        'ECON101',
        'Microeconomics',
        'Principles of microeconomics.',
        3.0,
        'Economics'
    ),
    (
        'ECON102',
        'Macroeconomics',
        'Principles of macroeconomics.',
        3.0,
        'Economics'
    ),
    (
        'POLS101',
        'Intro to Political Science',
        'Basics of politics.',
        3.0,
        'Political Science'
    ),
    (
        'PHIL101',
        'Intro to Philosophy',
        'Basics of philosophy.',
        3.0,
        'Philosophy'
    ),
    (
        'MUS101',
        'Music Appreciation',
        'History of music.',
        3.0,
        'Music'
    ),
    (
        'THEA101',
        'Intro to Theatre',
        'Basics of theatre arts.',
        3.0,
        'Theatre'
    ),
    (
        'ANTH101',
        'Intro to Anthropology',
        'Study of human societies.',
        3.0,
        'Anthropology'
    ),
    (
        'GEOG101',
        'Intro to Geography',
        'Study of earth and people.',
        3.0,
        'Geography'
    ),
    (
        'COMM101',
        'Public Speaking',
        'Effective communication.',
        3.0,
        'Communications'
    ),
    (
        'BUS101',
        'Intro to Business',
        'Basics of business administration.',
        3.0,
        'Business'
    );

-- 7. Insert Additional Course Offerings to meet 20-record requirement
INSERT INTO
    CourseOffering (
        CourseID,
        TermID,
        InstructorID,
        SectionNumber,
        MaxEnrollment
    )
VALUES (7, 1, 1, '001', 50), -- BIO101
    (8, 1, 2, '001', 50);
-- CHEM101

-- 8. Insert Additional Prerequisite to meet 5-record requirement
INSERT INTO
    CoursePrerequisite (CourseID, PrereqCourseID)
VALUES (6, 5);
-- Algorithms (if 6 exists?) Wait, CourseID 6 is ART100. Let's check IDs.
-- Course IDs: 1=CS101, 2=MATH203, 3=PHYS101, 4=ENGL220, 5=HIST301, 6=ART100.
-- Prereqs added previously: (2,1), (3,1), (4,2), (5,3).
-- Let's add (6, 5) -> ART100 requires HIST301 (just for data volume).