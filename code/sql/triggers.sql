--
-- Database Triggers
-- Automates business logic and data integrity
--

-- 1. Function to update enrollment count
CREATE OR REPLACE FUNCTION fn_UpdateEnrollmentCount()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        -- Increment count
        UPDATE CourseOffering
        SET CurrentEnrollment = CurrentEnrollment + 1
        WHERE OfferingID = NEW.OfferingID;
    ELSIF (TG_OP = 'DELETE') THEN
        -- Decrement count
        UPDATE CourseOffering
        SET CurrentEnrollment = CurrentEnrollment - 1
        WHERE OfferingID = OLD.OfferingID;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function
CREATE TRIGGER trg_UpdateEnrollmentCount
AFTER INSERT OR DELETE ON Enrollment
FOR EACH ROW
EXECUTE FUNCTION fn_UpdateEnrollmentCount();

-- 2. Function to prevent over-enrollment
CREATE OR REPLACE FUNCTION fn_PreventOverEnrollment()
RETURNS TRIGGER AS $$
DECLARE
    curr_count INTEGER;
    max_count INTEGER;
BEGIN
    -- Get current and max enrollment for the offering
    SELECT CurrentEnrollment, MaxEnrollment INTO curr_count, max_count
    FROM CourseOffering
    WHERE OfferingID = NEW.OfferingID;

    -- Check if full
    IF curr_count >= max_count THEN
        RAISE EXCEPTION 'Course is full. Cannot enroll.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function BEFORE insert
CREATE TRIGGER trg_PreventOverEnrollment
BEFORE INSERT ON Enrollment
FOR EACH ROW
EXECUTE FUNCTION fn_PreventOverEnrollment();
