
ALTER TABLE public.master_dataset
    DROP COLUMN type;

ALTER TABLE public.master_dataset
    ADD COLUMN media;

ALTER TABLE public.master_dataset
    RENAME difficulty_level TO label;

ALTER TABLE public.master_dataset
    RENAME TO sentences;