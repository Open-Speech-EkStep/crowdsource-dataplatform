ALTER TABLE IF EXISTS public.contributions
    ADD COLUMN IF NOT EXISTS "allowValidation" boolean NOT NULL DEFAULT true;

CREATE INDEX IF NOT EXISTS contribution_allowvalidation_index
    ON public.contributions USING btree
    (allow_validation ASC NULLS LAST)
;