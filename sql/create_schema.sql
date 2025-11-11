-- Master script to create the entire LMS database schema
-- This script executes all the individual table creation scripts in the correct order.

-- Core Academic Entities
\i sql/schema/01_user.sql
\i sql/schema/02_course.sql
\i sql/schema/03_term.sql
\i sql/schema/04_course_offering.sql
\i sql/schema/05_enrollment.sql

-- Assessment Entities
\i sql/schema/06_assignment.sql
\i sql/schema/07_submission.sql
\i sql/schema/08_quiz.sql
\i sql/schema/09_quiz_attempt.sql

-- Content Entities
\i sql/schema/10_module.sql
\i sql/schema/11_material.sql

-- Supporting Entities
\i sql/schema/12_grade.sql
