/* Replace with your SQL commands */
ALTER TABLE public.reward_milestones
    ADD COLUMN type text NOT NULL DEFAULT 'text';

ALTER TABLE public.reward_milestones
    ADD COLUMN category text NOT NULL DEFAULT 'contribute';
