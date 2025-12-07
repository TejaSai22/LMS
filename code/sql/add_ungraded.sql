-- Insert Ungraded Submissions (Score is NULL)
-- Using existing StudentIDs (15, 16, 17) which are within the valid range (Total Users=21)

INSERT INTO
    Submission (
        AssignmentID,
        StudentID,
        FileURL,
        IsLate,
        VersionNumber,
        Score
    )
VALUES (
        1,
        15,
        '/sub/cs101_hw1_s15_ungraded.zip',
        false,
        1,
        NULL
    ),
    (
        2,
        16,
        '/sub/cs101_hw2_s16_ungraded.zip',
        true,
        1,
        NULL
    ),
    (
        3,
        17,
        '/sub/cs101_hw3_s17_ungraded.zip',
        false,
        1,
        NULL
    );