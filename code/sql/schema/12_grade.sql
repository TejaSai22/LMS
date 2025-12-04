-- Create the Grade table
CREATE TABLE Grade (
    GradeID SERIAL PRIMARY KEY,
    EnrollmentID INTEGER NOT NULL UNIQUE REFERENCES Enrollment(EnrollmentID),
    NumericGrade DECIMAL(5,2) NULL CHECK (NumericGrade >= 0 AND NumericGrade <= 100),
    LetterGrade VARCHAR(5) NULL,
    GradeDate TIMESTAMP NULL,
    Comments TEXT NULL
);
