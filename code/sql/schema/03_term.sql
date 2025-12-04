-- Create a custom ENUM type for term types
CREATE TYPE term_type AS ENUM ('Fall', 'Spring', 'Summer', 'Winter');

-- Create the Term table
CREATE TABLE Term (
    TermID SERIAL PRIMARY KEY,
    TermName VARCHAR(50) NOT NULL UNIQUE,
    TermType term_type NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL CHECK (EndDate > StartDate),
    IsActive BOOLEAN NOT NULL DEFAULT TRUE
);
