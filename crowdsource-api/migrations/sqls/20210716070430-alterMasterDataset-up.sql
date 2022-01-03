ALTER TABLE public.master_dataset
    ADD COLUMN dataset_type varchar(20);

ALTER TABLE public.master_dataset
    ALTER COLUMN ingested_at SET DEFAULT CURRENT_TIMESTAMP;