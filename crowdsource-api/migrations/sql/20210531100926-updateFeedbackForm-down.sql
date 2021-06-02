/* Replace with your SQL commands */

ALTER TABLE feedbacks
    DROP COLUMN module;

ALTER TABLE feedbacks
    DROP COLUMN target_page;

ALTER TABLE feedbacks
    DROP COLUMN opinion_rating;

ALTER TABLE feedbacks
    RENAME category TO subject;
