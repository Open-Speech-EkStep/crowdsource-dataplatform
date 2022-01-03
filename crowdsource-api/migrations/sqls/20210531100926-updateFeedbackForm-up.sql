/* Replace with your SQL commands */

ALTER TABLE feedbacks
    ADD COLUMN module text;

ALTER TABLE feedbacks
    ADD COLUMN target_page text;

ALTER TABLE feedbacks
    ADD COLUMN opinion_rating integer;

ALTER TABLE feedbacks
    RENAME subject TO category;
