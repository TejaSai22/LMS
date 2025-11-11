-- Create a custom ENUM type for enrollment status
CREATE TYPE enrollment_status AS ENUM ('Enrolled', 'Dropped', 'Completed', 'Withdrawn');

-- Create the Enrollment table
CREATE TABLE Enrollment (
    EnrollmentID SERIAL PRIMARY KEY,
    StudentID INTEGER NOT NULL REFERENCES "User"(UserID),
    OfferingID INTEGER NOT NULL REFERENCES CourseOffering(OfferingID),
    EnrollmentDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Status enrollment_status NOT NULL DEFAULT 'Enrolled',
    DropDate TIMESTAMP NULL,
    UNIQUE (StudentID, OfferingID)
);
