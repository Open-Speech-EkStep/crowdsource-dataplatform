CREATE INDEX IF NOT EXISTS contributors_user_name_index
    ON public.contributors USING btree
    (user_name ASC NULLS LAST)
;

CREATE INDEX IF NOT EXISTS contributors_identifier_index
    ON public.contributors USING btree
    (contributor_identifier ASC NULLS LAST)
;