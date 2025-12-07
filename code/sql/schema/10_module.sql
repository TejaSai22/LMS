-- Create the Module table
CREATE TABLE Module (
    ModuleID SERIAL PRIMARY KEY,
    OfferingID INTEGER NOT NULL REFERENCES CourseOffering(OfferingID),
    ModuleName VARCHAR(200) NOT NULL,
    Description TEXT NULL,
    SequenceNumber INTEGER NOT NULL CHECK (SequenceNumber > 0),
    StartDate DATE NULL,
    EndDate DATE NULL,
    UNIQUE (OfferingID, SequenceNumber)
);
