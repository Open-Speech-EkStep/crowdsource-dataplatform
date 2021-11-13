ALTER TABLE public.contributors DROP CONSTRAINT IF EXISTS user_name_contributor_id_unique;

ALTER TABLE public.contributors
    ADD CONSTRAINT user_name_contributor_id_unique UNIQUE (contributor_identifier, user_name);