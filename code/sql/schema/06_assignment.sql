-- Create the Assignment table
CREATE TABLE Assignment (
    AssignmentID SERIAL PRIMARY KEY,
    OfferingID INTEGER NOT NULL REFERENCES CourseOffering(OfferingID),
    Title VARCHAR(200) NOT NULL,
    Description TEXT NULL,
    MaxPoints DECIMAL(5,2) NOT NULL CHECK (MaxPoints > 0),
    DueDate TIMESTAMP NOT NULL,
    WeightPercentage DECIMAL(5,2) NOT NULL CHECK (WeightPercentage >= 0 AND WeightPercentage <= 100),
    AllowLateSubmission BOOLEAN NOT NULL DEFAULT TRUE,
    CreatedDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
