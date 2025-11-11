-- Create the Course table
CREATE TABLE Course (
    CourseID SERIAL PRIMARY KEY,
    CourseCode VARCHAR(20) NOT NULL UNIQUE,
    CourseName VARCHAR(200) NOT NULL,
    Description TEXT NULL,
    CreditHours DECIMAL(3,1) NOT NULL CHECK (CreditHours > 0),
    Department VARCHAR(100) NOT NULL,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE
);
