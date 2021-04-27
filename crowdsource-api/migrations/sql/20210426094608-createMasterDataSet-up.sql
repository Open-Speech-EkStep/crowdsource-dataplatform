CREATE TABLE public.master_dataset
(
    master_dataset_id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    params jsonb NOT NULL,
    localtion text NULL,
    PRIMARY KEY (master_dataset_id)
)
WITH (
    OIDS = FALSE
);

ALTER TABLE public.sentences
    ADD COLUMN master_dataset_id integer;
ALTER TABLE public.sentences
    ADD CONSTRAINT "master_dataset_FK" FOREIGN KEY (master_dataset_id)
    REFERENCES public.master_dataset (master_dataset_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

ALTER TABLE public.master_dataset
    OWNER to postgres;

ALTER TABLE public.sentences
    RENAME TO dataset_row;

ALTER TABLE public.dataset_row
    RENAME "sentenceId" TO dataset_row_id;

ALTER TABLE public.dataset_row
    RENAME label TO difficulty_level;

ALTER TABLE public.contributions
    RENAME "sentenceId" TO dataset_row_id;

insert into contributors (user_name, contributor_identifier)
select '##system##', '##system##';