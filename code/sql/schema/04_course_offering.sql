-- Create the CourseOffering table
CREATE TABLE CourseOffering (
    OfferingID SERIAL PRIMARY KEY,
    CourseID INTEGER NOT NULL REFERENCES Course(CourseID),
    TermID INTEGER NOT NULL REFERENCES Term(TermID),
    InstructorID INTEGER NOT NULL REFERENCES "User"(UserID),
    SectionNumber VARCHAR(10) NOT NULL,
    MaxEnrollment INTEGER NOT NULL CHECK (MaxEnrollment > 0),
    CurrentEnrollment INTEGER NOT NULL DEFAULT 0 CHECK (CurrentEnrollment >= 0),
    Schedule VARCHAR(100) NULL,
    Location VARCHAR(100) NULL,
    UNIQUE (CourseID, TermID, SectionNumber)
);
