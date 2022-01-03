ALTER TABLE public.reports
    ADD COLUMN source character varying(15) NOT NULL DEFAULT 'contribution';