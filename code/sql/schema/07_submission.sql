-- Create the Submission table
CREATE TABLE Submission (
    SubmissionID SERIAL PRIMARY KEY,
    AssignmentID INTEGER NOT NULL REFERENCES Assignment(AssignmentID),
    StudentID INTEGER NOT NULL REFERENCES "User"(UserID),
    SubmissionDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FileURL VARCHAR(500) NULL,
    SubmissionText TEXT NULL,
    Score DECIMAL(5,2) NULL CHECK (Score >= 0),
    Feedback TEXT NULL,
    IsLate BOOLEAN NOT NULL DEFAULT FALSE,
    VersionNumber INTEGER NOT NULL DEFAULT 1,
    GradedDate TIMESTAMP NULL,
    GradedByID INTEGER NULL REFERENCES "User"(UserID)
);
