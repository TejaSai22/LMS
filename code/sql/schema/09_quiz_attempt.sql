-- Create the QuizAttempt table
CREATE TABLE QuizAttempt (
    AttemptID SERIAL PRIMARY KEY,
    QuizID INTEGER NOT NULL REFERENCES Quiz(QuizID),
    StudentID INTEGER NOT NULL REFERENCES "User"(UserID),
    AttemptNumber INTEGER NOT NULL CHECK (AttemptNumber > 0),
    StartTime TIMESTAMP NOT NULL,
    SubmitTime TIMESTAMP NULL,
    Score DECIMAL(5,2) NULL CHECK (Score >= 0),
    IsCompleted BOOLEAN NOT NULL DEFAULT FALSE,
    ResponsesJSON JSON NULL,
    UNIQUE (QuizID, StudentID, AttemptNumber)
);
