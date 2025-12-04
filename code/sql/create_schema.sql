--
-- Master Schema Creation Script
-- This script runs all individual schema definition files.
--

-- Core Entities
\i code/sql/schema/01_user.sql
\i code/sql/schema/02_course.sql
\i code/sql/schema/03_term.sql
\i code/sql/schema/04_course_offering.sql
\i code/sql/schema/05_enrollment.sql

-- Academic Entities
\i code/sql/schema/06_assignment.sql
\i code/sql/schema/07_submission.sql
\i code/sql/schema/08_quiz.sql
\i code/sql/schema/09_quiz_attempt.sql

-- Content Entities
\i code/sql/schema/10_module.sql
\i code/sql/schema/11_material.sql

-- Grading Entity
\i code/sql/schema/12_grade.sql
