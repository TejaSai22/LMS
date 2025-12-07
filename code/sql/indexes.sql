--
-- Database Indexes
-- Improves query performance for common lookups and joins
--

-- 1. User Lookups
-- Email is already UNIQUE (which creates an index), but we might search by name
CREATE INDEX idx_user_lastname ON "User" (LastName);
CREATE INDEX idx_user_role ON "User" (Role);

-- 2. Course Lookups
CREATE INDEX idx_course_code ON Course (CourseCode);
CREATE INDEX idx_course_dept ON Course (Department);

-- 3. Enrollment Lookups
-- Frequent joins on StudentID and OfferingID
CREATE INDEX idx_enrollment_student ON Enrollment (StudentID);
CREATE INDEX idx_enrollment_offering ON Enrollment (OfferingID);

-- 4. Submission Lookups
-- Frequent joins on AssignmentID and StudentID
CREATE INDEX idx_submission_assignment ON Submission (AssignmentID);
CREATE INDEX idx_submission_student ON Submission (StudentID);

-- 5. Grade Lookups
CREATE INDEX idx_grade_enrollment ON Grade (EnrollmentID);

-- 6. Course Offering Lookups
CREATE INDEX idx_offering_term ON CourseOffering (TermID);
CREATE INDEX idx_offering_instructor ON CourseOffering (InstructorID);
CREATE INDEX idx_offering_course ON CourseOffering (CourseID);
