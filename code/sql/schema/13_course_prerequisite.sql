-- Create the CoursePrerequisite table
CREATE TABLE CoursePrerequisite (
    PrerequisiteID SERIAL PRIMARY KEY,
    CourseID INTEGER NOT NULL REFERENCES Course (CourseID),
    PrereqCourseID INTEGER NOT NULL REFERENCES Course (CourseID),
    UNIQUE (CourseID, PrereqCourseID),
    CHECK (CourseID <> PrereqCourseID) -- Prevent self-reference
);