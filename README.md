# INFO 5707 – Data Modeling: Learning Management System (LMS) Database

**Group 18:**
- Divyasree Pithani (Team Coordinator)
- Teja Sai Srinivas Kunisetty
- Keerthi Yeakambaram

## Table of Contents
- [Summary](#summary)
- [Introduction](#introduction)
- [Objectives and Scope](#objectives-and-scope)
- [User Requirements](#user-requirements)
- [Business Rules](#business-rules)
- [Entity-Relationship Diagram (ERD)](#entity-relationship-diagram-erd)
- [Data Dictionary](#data-dictionary)
- [Choice of DBMS](#choice-of-dbms)
- [AI Use Disclosure Statement](#ai-use-disclosure-statement)

## Summary

This project outlines the construction of a large-scale database system for an Online Learning Management System (LMS) to automate online courses, instructor management, student enrollment, assignments, quizzes, and grades. The system will provide educational institutions with a single, secure platform for managing all online learning activities. Using PostgreSQL as the DBMS, the project will be enterprise-level with role-based access control, multi-user concurrency support, management of multimedia material, and the ability to report comprehensively. The database will be capable of handling the whole process of learning from course setup to the admission of students through to examination distribution and grading management, with data integrity and optimal performance for all stakeholders.

## Introduction

Online education is finding its way into routine delivery in the rapidly evolving era of education in the modern world. Education schools and training schools should possess robust, scalable infrastructures to provide high-end interactions between students, instructors, courseware, and training tests. The center of gravity of e-education is an LMS, which aids in effective course delivery, student cooperation, and monitoring of performance.

The project will implement and deploy a full database system for an Online Learning Management System that emulates the features of such systems as Canvas, Coursera, and Moodle. The database will serve as an information source and will implement all online learning functionalities like management of users, structuring of courses, presentation of course materials, uploading of assignments, quizzing, and monitoring of grades.

With this database system architecture, we seek to establish an efficient, scalable, and secure system that would be strong enough to handle multi-dimensional educational needs of such as course content viewing and assignment submission by students, course creation and assignment grading by instructors, institution operations management, and provision of analytical reports by administrators.

This project outlines that we will have a database system in which the whole process of online learning activity will be stored without any loss in data security, integrity, and performance.

## Objectives and Scope

### Vision

Our goal is to develop a robust, enterprise-level relational database system that acts as the essential data layer for managing online learning platforms. This system will enable educational institutions to effectively oversee, monitor, and evaluate every facet of digital education delivery.

### Mission

Design and implement a normalized, scalable database architecture that guarantees data integrity, supports simultaneous multi-user access, maintains detailed academic records, and ensures smooth collaboration among students, instructors, and administrators throughout the process.

### Primary Objectives

- **Objective 1: Unified Academic Data Management:** Establish a single authoritative source for all academic information, about course catalogs, enrollment details, curriculum frameworks, and academic performance metrics over various terms and academic years.
- **Objective 2: User Identity and Access Management:** Develop a strong user management system that facilitates role-based access control for students, instructors, teaching assistants, and administrators, ensuring appropriate data security and privacy measures.
- **Objective 3: Course Content and Curriculum Organization:** Facilitate the organized arrangement of course materials, learning modules, and instructional content, with provisions for prerequisites, course sequencing, and curriculum pathways.
- **Objective 4: Assessment and Evaluation Tracking:** Keep detailed records of all assessments, including assignments, quizzes, exams, submissions, grading history, and performance analytics, with complete audit trails.
- **Objective 5: Enrollment and Registration Processing:** Facilitate comprehensive student enrollment processes, including course registration, waitlist management, enrollment capacity enforcement, and prerequisite validation.
- **Objective 6: Grade Management and Academic Records:** Manage, store, and monitor student grades, supporting weighted grading systems, grade distributions, cumulative performance metrics, and transcript generation.

### Scope Definition

- **Organization Type:** Educational institutions including universities, colleges, community colleges, corporate training centers, and online education platforms.
- **Functional Coverage:**
  - Academic administration and institutional management
  - Course catalog and curriculum management
  - Student information and enrollment systems
  - Instructor assignment and course scheduling
  - Assessment creation, submission, and grading
  - Performance tracking and academic analytics
  - User authentication and authorization
- **Database Scope Level:** Enterprise-level system covering institution-wide online learning operations
- **Key Functional Areas:**
  - User management and role-based security
  - Course and curriculum administration
  - Enrollment and registration processing
  - Content organization and module structuring
  - Assignment and quiz management
  - Submission tracking and version control
  - Grading workflows and grade calculation
  - Academic reporting and analytics
  - Term/semester data organization
- **Out of Scope:**
  - User interface design and web application development
  - API implementation and endpoint definitions
  - Payment processing and financial transactions
  - Email notification systems
  - Video streaming infrastructure
  - Third-party integration specifications
  - Mobile application development

## User Requirements

- **UR-1: Student Enrollment Management:** The database will handle and store records of student enrollments for courses, including details such as enrollment dates, status (active, dropped, completed), and validation of enrollment capacity to avoid over-enrollment in courses.
- **UR-2: Course Structure and Organization:** The database will keep course details, including course codes, titles, descriptions, credit hours, department affiliations, and prerequisite links to aid in curriculum planning.
- **UR-3: Multi-Term Academic Calendar Support:** The database will accommodate multiple academic terms or semesters with unique start and end dates, enabling courses to be offered in various terms while preserving historical academic records.
- **UR-4: Assignment Lifecycle Management:** The database will monitor the entire lifecycle of assignments, from creation to assignment to courses, student submissions with timestamps and grading status.
- **UR-5: Quiz and Assessment Administration:** The database will store quiz definitions, question banks with various question types (multiple choice, true/false, essay, file upload), student responses, and automated scoring for objective question types.
- **UR-6: Comprehensive Grading System:** The database will compute and store grades for individual assessments, support weighted grading categories (assignments, quizzes, exams), and calculate final course grades based on configurable grading schemes.
- **UR-7: Role-Based Access Control:** The database will implement role-based security, allowing students to access only their enrolled courses and submissions, instructors to manage only their assigned courses, and administrators to have system-wide access for reporting and management.
- **UR-8: Course Material Organization:** The database will arrange course materials into modules and topics with defined sequencing, supporting multimedia content references and maintaining links between materials and specific course offerings.
- **UR-9: Instructor Assignment and Management:** The database will track instructor assignments to courses, support multiple instructors per course, and maintain teaching assistant associations with specific course sections or roles.
- **UR-10: Historical Academic Performance Tracking:** The database will preserve complete historical records of student academic performance, including all submissions, grades, enrollment history, and course completions, to support transcript generation and academic advising.
- **UR-11: Deadline and Late Submission Tracking:** The database will store assignment and quiz due dates, track submission timestamps, and identify late submissions to support late penalty calculations and deadline enforcement.
- **UR-12: Grade Distribution Analytics:** The database will facilitate queries for grade distribution analysis, including class averages, grade curves, performance comparisons across sections, and historical trend analysis for institutional reporting.

## Business Rules

- **BR-1: Enrollment Capacity Enforcement:** Every course being offered should have a set limit for enrolment. Students are not allowed to enroll in a course section when the number of enrolments goes above the maximum capacity unless it is administratively overridden.
- **BR-2: Prerequisite Validation:** A student can qualify to take a course only when he has passed all the prerequisite courses with a passing grade (grade ≥ D or as per the institution) or administrative permission to skip prerequisites.
- **BR-3: Special Student Admission:** Enrolment into a certain course can only be made by a student once in a term. The system should not allow an over-enrollment of the same course section in the same academic term.
- **BR-4 Instructor Course Essay:** All the courses provided should contain at least one tutor in charge of the course. Without an instructor assignment, a course cannot become active so that it can be enrolled by students.
- **BR-5: Deadline for Submission:** All assignments and quizzes should have a certain deadline and time. Students may post work later than the deadline, the system should indicate that it is late and the delay period should be logged.
- **BR-6: Grade Value Constraints:** All marks should be in good ranges: marks in individual assignments/quizzes (or points in maximum points) should range between 0-100 (or 0 to maximum points indicated) and final mark should be out of the institutional grade scale (A, A-, B+, B, B-, C+, C, D, F, or equivalent).
- **BR-7: Submission Versioning:** In cases where a student makes several submissions of an assignment before the due date, only the system should save all the submissions including timestamps. The last submission before the deadline is taken to be the official submission to be graded unless the instructor specifies differently.
- **BR-8: Grade Calculation Integrity:** The computation of final course grades should be done using graded assessments in the course offering. Calculation should be done according to the weighting scheme set by the instructor and all weights of the categories should not exceed 100%.
- **BR-9: Role Assignment Rules:** Users should be given at least one role (Student, Instructor, Teaching Assistant or Administrator). Multiple roles can be assigned to users (e.g. a graduate student is also a teaching assistant).
- **BR-10: Term Association of Course Offering:** Courses of study should have only one academic term. Courses cannot be offered in more than one term; individual offerings will have to be made for courses taught in different terms.
- **BR-11: Assessment Ownership:** The quizzes (assignments and tests) should be produced by and be in a particular course offering. Assessment types cannot stand alone and will be deleted in case the parent course offering is deleted.
- **BR-12: Transition of Enrollment Status:** The enrollment status of students should be made in accordance with legitimate transitions between the states: Pending-> Enrolled-> (Completed OR Dropped OR Withdrawn). Dropped/Withdrawn students are unable to move to Enrolled without establishing a new record of enrollment.

## Entity-Relationship Diagram (ERD)

### ERD Description

The LMS database consists of 12 core entities organized around academic operations:

- **Core Academic Entities:**
  - `User`: Stores all system users (students, instructors, administrators)
  - `Course`: Defines course catalog entries
  - `Term`: Represents academic terms/semesters
  - `CourseOffering`: Links courses to specific terms with instructors
  - `Enrollment`: Records student-course registrations
- **Assessment Entities:**
  - `Assignment`: Defines course assignments
  - `Quiz`: Defines course quizzes/exams
  - `Submission`: Tracks student assignment submissions
  - `QuizAttempt`: Records student quiz attempts
- **Content Entities:**
  - `Module`: Organizes course content into sections
  - `Material`: Stores course materials and resources
- **Supporting Entities:**
  - `Grade`: Records final course grades

### Key Relationships

1.  **User to CourseOffering (as Instructor):** One-to-Many
    - An instructor can teach multiple course offerings
    - Each course offering must have one primary instructor
2.  **User to Enrollment (as Student):** One-to-Many
    - A student can enroll in multiple courses
    - Each enrollment belongs to one student
3.  **Course to Course Offering:** One-to-Many
    - A course can have multiple offerings across terms
    - Each offering is of exactly one course
4.  **Term to CourseOffering:** One-to-Many
    - A term contains multiple course offerings
    - Each offering belongs to one term
5.  **CourseOffering to Assignment:** One-to-Many
    - A course offering can have multiple assignments
    - Each assignment belongs to one course offering
6.  **CourseOffering to Quiz:** One-to-Many
    - A course offering can have multiple quizzes
    - Each quiz belongs to one course offering
7.  **Assignment to Submission:** One-to-Many
    - An assignment can receive multiple submissions (from different students)
    - Each submission is for one assignment
8.  **Quiz to QuizAttempt:** One-to-Many
    - A quiz can have multiple attempts (from different students)
    - Each attempt is for one quiz
9.  **Enrollment to Grade:** One-to-One
    - Each enrollment may have one final grade
    - Each grade belongs to one enrollment
10. **CourseOffering to Module:** One-to-Many
    - A course offering organizes content into multiple modules
    - Each module belongs to one course offering
11. **Module to Material:** One-to-Many
    - A module contains multiple materials
    - Each material belongs to one module

## Data Dictionary

### Entity: User

| Attribute     | Data Type | Length | Constraints                             | Description                                 |
|---------------|-----------|--------|-----------------------------------------|---------------------------------------------|
| UserID        | INTEGER   | -      | PK, NOT NULL, AUTO_INCREMENT            | Unique identifier for each user             |
| FirstName     | VARCHAR   | 50     | NOT NULL                                | User's first name                           |
| LastName      | VARCHAR   | 50     | NOT NULL                                | User's last name                            |
| Email         | VARCHAR   | 100    | NOT NULL, UNIQUE                        | User's email address (used for login)       |
| PasswordHash  | VARCHAR   | 255    | NOT NULL                                | Encrypted password hash                     |
| Role          | ENUM      | -      | NOT NULL                                | User role: 'Student', 'Instructor', 'TA', 'Admin' |
| DateCreated   | TIMESTAMP | -      | NOT NULL, DEFAULT CURRENT_TIMESTAMP     | Account creation date                       |
| LastLogin     | TIMESTAMP | -      | NULL                                    | Last login timestamp                        |
| IsActive      | BOOLEAN   | -      | NOT NULL, DEFAULT TRUE                  | Account active status                       |

### Entity: Course

| Attribute   | Data Type | Length | Constraints                             | Description                               |
|-------------|-----------|--------|-----------------------------------------|-------------------------------------------|
| CourseID    | INTEGER   | -      | PK, NOT NULL, AUTO_INCREMENT            | Unique identifier for each course         |
| CourseCode  | VARCHAR   | 20     | NOT NULL, UNIQUE                        | Course code (e.g., 'INFO5707')            |
| CourseName  | VARCHAR   | 200    | NOT NULL                                | Full course title                         |
| Description | TEXT      | -      | NULL                                    | Detailed course description               |
| CreditHours | DECIMAL   | (3,1)  | NOT NULL, CHECK (CreditHours > 0)       | Number of credit hours                    |
| Department  | VARCHAR   | 100    | NOT NULL                                | Academic department offering course       |
| IsActive    | BOOLEAN   | -      | NOT NULL, DEFAULT TRUE                  | Course catalog active status              |

### Entity: Term

| Attribute | Data Type | Length | Constraints                             | Description                             |
|-----------|-----------|--------|-----------------------------------------|-----------------------------------------|
| TermID    | INTEGER   | -      | PK, NOT NULL, AUTO_INCREMENT            | Unique identifier for each term         |
| TermName  | VARCHAR   | 50     | NOT NULL, UNIQUE                        | Term name (e.g., 'Fall 2025')           |
| TermType  | ENUM      | -      | NOT NULL                                | Term type: 'Fall', 'Spring', 'Summer', 'Winter' |
| StartDate | DATE      | -      | NOT NULL                                | Term start date                         |
| EndDate   | DATE      | -      | NOT NULL, CHECK (EndDate > StartDate)   | Term end date                           |
| IsActive  | BOOLEAN   | -      | NOT NULL, DEFAULT TRUE                  | Current term indicator                  |

### Entity: CourseOffering

| Attribute         | Data Type | Length | Constraints                                  | Description                               |
|-------------------|-----------|--------|----------------------------------------------|-------------------------------------------|
| OfferingID        | INTEGER   | -      | PK, NOT NULL, AUTO_INCREMENT                 | Unique identifier for course offering     |
| CourseID          | INTEGER   | -      | FK (Course), NOT NULL                        | Reference to course                       |
| TermID            | INTEGER   | -      | FK (Term), NOT NULL                          | Reference to term                         |
| InstructorID      | INTEGER   | -      | FK (User), NOT NULL                          | Reference to instructor user              |
| SectionNumber     | VARCHAR   | 10     | NOT NULL                                     | Section identifier (e.g., '001', 'A')     |
| MaxEnrollment     | INTEGER   | -      | NOT NULL, CHECK (MaxEnrollment > 0)          | Maximum student capacity                  |
| CurrentEnrollment | INTEGER   | -      | NOT NULL, DEFAULT 0, CHECK (CurrentEnrollment >= 0) | Current number of enrolled students       |
| Schedule          | VARCHAR   | 100    | NULL                                         | Meeting schedule description              |
| Location          | VARCHAR   | 100    | NULL                                         | Physical or virtual location              |
|                   |           |        | UNIQUE (CourseID, TermID, SectionNumber)     | Ensures unique sections per term          |

### Entity: Enrollment

| Attribute      | Data Type | Length | Constraints                             | Description                               |
|----------------|-----------|--------|-----------------------------------------|-------------------------------------------|
| EnrollmentID   | INTEGER   | -      | PK, NOT NULL, AUTO_INCREMENT            | Unique identifier for enrollment          |
| StudentID      | INTEGER   | -      | FK (User), NOT NULL                     | Reference to student user                 |
| OfferingID     | INTEGER   | -      | FK (CourseOffering), NOT NULL           | Reference to course offering              |
| EnrollmentDate | TIMESTAMP | -      | NOT NULL, DEFAULT CURRENT_TIMESTAMP     | Date student enrolled                     |
| Status         | ENUM      | -      | NOT NULL, DEFAULT 'Enrolled'            | Status: 'Enrolled', 'Dropped', 'Completed', 'Withdrawn' |
| DropDate       | TIMESTAMP | -      | NULL                                    | Date enrollment was dropped (if applicable) |
|                |           |        | UNIQUE (StudentID, OfferingID)          | Prevents duplicate enrollments            |

### Entity: Assignment

| Attribute           | Data Type | Length | Constraints                                  | Description                               |
|---------------------|-----------|--------|----------------------------------------------|-------------------------------------------|
| AssignmentID        | INTEGER   | -      | PK, NOT NULL, AUTO_INCREMENT                 | Unique identifier for assignment          |
| OfferingID          | INTEGER   | -      | FK (CourseOffering), NOT NULL                | Reference to course offering              |
| Title               | VARCHAR   | 200    | NOT NULL                                     | Assignment title                          |
| Description         | TEXT      | -      | NULL                                         | Detailed assignment instructions          |
| MaxPoints           | DECIMAL   | (5,2)  | NOT NULL, CHECK (MaxPoints > 0)              | Maximum possible points                   |
| DueDate             | TIMESTAMP | -      | NOT NULL                                     | Assignment due date and time              |
| WeightPercentage    | DECIMAL   | (5,2)  | NOT NULL, CHECK (WeightPercentage >= 0 AND WeightPercentage <= 100) | Weight toward final grade                 |
| AllowLateSubmission | BOOLEAN   | -      | NOT NULL, DEFAULT TRUE                       | Allow submissions after due date          |
| CreatedDate         | TIMESTAMP | -      | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Assignment creation date                  |

### Entity: Submission

| Attribute      | Data Type | Length | Constraints                             | Description                               |
|----------------|-----------|--------|-----------------------------------------|-------------------------------------------|
| SubmissionID   | INTEGER   | -      | PK, NOT NULL, AUTO_INCREMENT            | Unique identifier for submission          |
| AssignmentID   | INTEGER   | -      | FK (Assignment), NOT NULL               | Reference to assignment                   |
| StudentID      | INTEGER   | -      | FK (User), NOT NULL                     | Reference to student user                 |
| SubmissionDate | TIMESTAMP | -      | NOT NULL, DEFAULT CURRENT_TIMESTAMP     | Submission timestamp                      |
| FileURL        | VARCHAR   | 500    | NULL                                    | URL/path to submitted file                |
| SubmissionText | TEXT      | -      | NULL                                    | Text submission content                   |
| Score          | DECIMAL   | (5,2)  | NULL, CHECK (Score >= 0)                | Points earned                             |
| Feedback       | TEXT      | -      | NULL                                    | Instructor feedback                       |
| IsLate         | BOOLEAN   | -      | NOT NULL, DEFAULT FALSE                 | Late submission indicator                 |
| VersionNumber  | INTEGER   | -      | NOT NULL, DEFAULT 1                     | Submission version number                 |
| GradedDate     | TIMESTAMP | -      | NULL                                    | Date submission was graded                |
| GradedByID     | INTEGER   | -      | FK (User), NULL                         | Reference to grader (instructor/TA)       |

### Entity: Quiz

| Attribute        | Data Type | Length | Constraints                                  | Description                               |
|------------------|-----------|--------|----------------------------------------------|-------------------------------------------|
| QuizID           | INTEGER   | -      | PK, NOT NULL, AUTO_INCREMENT                 | Unique identifier for quiz                |
| OfferingID       | INTEGER   | -      | FK (CourseOffering), NOT NULL                | Reference to course offering              |
| Title            | VARCHAR   | 200    | NOT NULL                                     | Quiz title                                |
| Description      | TEXT      | -      | NULL                                         | Quiz instructions                         |
| MaxPoints        | DECIMAL   | (5,2)  | NOT NULL, CHECK (MaxPoints > 0)              | Maximum possible points                   |
| DueDate          | TIMESTAMP | -      | NOT NULL                                     | Quiz due date and time                    |
| TimeLimit        | INTEGER   | -      | NULL, CHECK (TimeLimit > 0)                  | Time limit in minutes (NULL = unlimited)  |
| WeightPercentage | DECIMAL   | (5,2)  | NOT NULL, CHECK (WeightPercentage >= 0 AND WeightPercentage <= 100) | Weight toward final grade                 |
| NumberOfAttempts | INTEGER   | -      | NOT NULL, DEFAULT 1, CHECK (NumberOfAttempts > 0) | Allowed number of attempts                |
| CreatedDate      | TIMESTAMP | -      | NOT NULL, DEFAULT CURRENT_TIMESTAMP          | Quiz creation date                        |

### Entity: QuizAttempt

| Attribute     | Data Type | Length | Constraints                             | Description                               |
|---------------|-----------|--------|-----------------------------------------|-------------------------------------------|
| AttemptID     | INTEGER   | -      | PK, NOT NULL, AUTO_INCREMENT            | Unique identifier for quiz attempt        |
| QuizID        | INTEGER   | -      | FK (Quiz), NOT NULL                     | Reference to quiz                         |
| StudentID     | INTEGER   | -      | FK (User), NOT NULL                     | Reference to student user                 |
| AttemptNumber | INTEGER   | -      | NOT NULL, CHECK (AttemptNumber > 0)     | Attempt number for this student           |
| StartTime     | TIMESTAMP | -      | NOT NULL                                | When student started quiz                 |
| SubmitTime    | TIMESTAMP | -      | NULL                                    | When student submitted quiz               |
| Score         | DECIMAL   | (5,2)  | NULL, CHECK (Score >= 0)                | Points earned                             |
| IsCompleted   | BOOLEAN   | -      | NOT NULL, DEFAULT FALSE                 | Quiz completion status                    |
| ResponsesJSON | JSON      | -      | NULL                                    | Student responses to questions            |
|               |           |        | UNIQUE (QuizID, StudentID, AttemptNumber) | Ensures unique attempt numbers per student |

### Entity: Module

| Attribute      | Data Type | Length | Constraints                             | Description                               |
|----------------|-----------|--------|-----------------------------------------|-------------------------------------------|
| ModuleID       | INTEGER   | -      | PK, NOT NULL, AUTO_INCREMENT            | Unique identifier for module              |
| OfferingID     | INTEGER   | -      | FK (CourseOffering), NOT NULL           | Reference to course offering              |
| ModuleName     | VARCHAR   | 200    | NOT NULL                                | Module title                              |
| Description    | TEXT      | -      | NULL                                    | Module description                        |
| SequenceNumber | INTEGER   | -      | NOT NULL, CHECK (SequenceNumber > 0)    | Module order within course                |
| StartDate      | DATE      | -      | NULL                                    | Module availability start date            |
| EndDate        | DATE      | -      | NULL                                    | Module availability end date              |
|                |           |        | UNIQUE (OfferingID, SequenceNumber)     | Ensures unique sequence numbers per offering |

### Entity: Material

| Attribute      | Data Type | Length | Constraints                             | Description                               |
|----------------|-----------|--------|-----------------------------------------|-------------------------------------------|
| MaterialID     | INTEGER   | -      | PK, NOT NULL, AUTO_INCREMENT            | Unique identifier for material            |
| ModuleID       | INTEGER   | -      | FK (Module), NOT NULL                   | Reference to module                       |
| Title          | VARCHAR   | 200    | NOT NULL                                | Material title                            |
| Description    | TEXT      | -      | NULL                                    | Material description                      |
| ContentType    | ENUM      | -      | NOT NULL                                | Type: 'Document', 'Video', 'Link', 'PDF', 'Image' |
| FileURL        | VARCHAR   | 500    | NULL                                    | URL/path to file or link                  |
| SequenceNumber | INTEGER   | -      | NOT NULL, CHECK (SequenceNumber > 0)    | Material order within module              |
| UploadDate     | TIMESTAMP | -      | NOT NULL, DEFAULT CURRENT_TIMESTAMP     | Date material was added                   |
|                |           |        | UNIQUE (ModuleID, SequenceNumber)       | Ensures unique sequence numbers per module |

### Entity: Grade

| Attribute    | Data Type | Length | Constraints                             | Description                               |
|--------------|-----------|--------|-----------------------------------------|-------------------------------------------|
| GradeID      | INTEGER   | -      | PK, NOT NULL, AUTO_INCREMENT            | Unique identifier for grade record        |
| EnrollmentID | INTEGER   | -      | FK (Enrollment), NOT NULL, UNIQUE       | Reference to enrollment (one grade per enrollment) |
| NumericGrade | DECIMAL   | (5,2)  | NULL, CHECK (NumericGrade >= 0 AND NumericGrade <= 100) | Calculated numeric grade                |
| LetterGrade  | VARCHAR   | 5      | NULL                                    | Letter grade (A, A-, B+, etc.)            |
| GradeDate    | TIMESTAMP | -      | NULL                                    | Date grade was finalized                  |
| Comments     | TEXT      | -      | NULL                                    | Additional comments from instructor       |

## Choice of DBMS

- **Selected DBMS:** PostgreSQL 15+
- **Justification:**
  - **Open Source and Low Cost:** Completely free to deploy with zero license expense, best to deploy in academies
  - **Enhanced Transaction Support:** Provides data consistency for business-critical transactions like posting grades and enrolling students
  - **Advanced Security Features:** Includes embedded role-based security, row-level security, and SSL support to safeguard sensitive student data
  - **Scalability:** Large data and large concurrent user scale support, suitable for growth-planning organizations
  - **Rich Data Types:** Explicit support for array, JSON, and binary data types to support rich course content and media objects
  - **Strong Community Support:** Thoroughly documented, moderate community support for education deployment profiles
  - **Cross-Platform Compatibility:** Support for all the most common operating systems to make it easy to deploy
  - **Industry Adoption:** Used in production environments and sufficient for educational use deployment
- **Alternative Choice:** MySQL/MariaDB can be an alternative, but the better performance of PostgreSQL with complex queries, SQL standard compliance, and support for built-in features make it a better choice to host this enterprise application.

## AI Use Disclosure Statement

- **AI Tools Used:**
  - Claude AI (Anthropic) was used to assist with structuring the proposal document, expanding on technical requirements, and ensuring comprehensive coverage of user requirements and scope definition.
  - Gemini (2.5 Flash) was used to assist with structuring the Design Phase Report, refining business rules, expanding user requirements, and improving grammar and clarity.
- **Human Contributions:** All project concepts, team decisions, and core content were developed by the team members. AI was used as a writing assistant to improve clarity, organization, and professional presentation of our ideas.
- **Verification:** The AI-generated suggestions were all checked, confirmed, and accepted by the team members to make sure that they are accurate, relevant, and correspond to the course requirements and principles of database design.
- **Limitations Acknowledged:** The team recognizes that human judgment cannot be substituted by the use of AI tools in determining what to include in a database design. The overall design decision is based on the knowledge the team had on the problem domain and the database normalization principles.
