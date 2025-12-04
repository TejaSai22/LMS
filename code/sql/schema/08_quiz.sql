-- Create the Quiz table
CREATE TABLE Quiz (
    QuizID SERIAL PRIMARY KEY,
    OfferingID INTEGER NOT NULL REFERENCES CourseOffering(OfferingID),
    Title VARCHAR(200) NOT NULL,
    Description TEXT NULL,
    MaxPoints DECIMAL(5,2) NOT NULL CHECK (MaxPoints > 0),
    DueDate TIMESTAMP NOT NULL,
    TimeLimit INTEGER NULL CHECK (TimeLimit > 0),
    WeightPercentage DECIMAL(5,2) NOT NULL CHECK (WeightPercentage >= 0 AND WeightPercentage <= 100),
    NumberOfAttempts INTEGER NOT NULL DEFAULT 1 CHECK (NumberOfAttempts > 0),
    CreatedDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
