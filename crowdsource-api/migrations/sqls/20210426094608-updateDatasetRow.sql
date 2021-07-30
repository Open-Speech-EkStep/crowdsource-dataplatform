ALTER TABLE public.dataset_row
    ADD COLUMN profanity_checked_by text;

ALTER TABLE public.dataset_row
    ADD COLUMN profanity_checked_at timestamp without time zone;

ALTER TABLE public.dataset_row
    ADD COLUMN is_profane boolean;

ALTER TABLE public.dataset_row
    ADD COLUMN assigned_for_profanity_check boolean DEFAULT false;
