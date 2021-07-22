ALTER TABLE public.master_dataset
    ADD COLUMN ingested_at timestamp;

ALTER TABLE public.master_dataset
    ADD COLUMN ingested_by varchar(100);