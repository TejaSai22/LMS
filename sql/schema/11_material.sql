-- Create a custom ENUM type for material content types
CREATE TYPE content_type AS ENUM ('Document', 'Video', 'Link', 'PDF', 'Image');

-- Create the Material table
CREATE TABLE Material (
    MaterialID SERIAL PRIMARY KEY,
    ModuleID INTEGER NOT NULL REFERENCES Module(ModuleID),
    Title VARCHAR(200) NOT NULL,
    Description TEXT NULL,
    ContentType content_type NOT NULL,
    FileURL VARCHAR(500) NULL,
    SequenceNumber INTEGER NOT NULL CHECK (SequenceNumber > 0),
    UploadDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (ModuleID, SequenceNumber)
);
