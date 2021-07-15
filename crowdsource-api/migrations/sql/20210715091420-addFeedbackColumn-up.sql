/* Replace with your SQL commands */

ALTER TABLE public.feedbacks
    ADD COLUMN recommended text;

ALTER TABLE public.feedbacks
    ADD COLUMN revisit text;