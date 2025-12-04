-- Create a custom ENUM type for user roles
CREATE TYPE user_role AS ENUM ('Student', 'Instructor', 'TA', 'Admin');

-- Create the User table
CREATE TABLE "User" (
    UserID SERIAL PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Role user_role NOT NULL,
    DateCreated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    LastLogin TIMESTAMP NULL,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE
);
