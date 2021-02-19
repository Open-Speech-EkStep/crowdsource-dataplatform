CREATE TABLE public.contributions
(
    contribution_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    sentence_id integer NOT NULL,
    audio_path text COLLATE pg_catalog."default",
    contributed_by integer NOT NULL,
    date date NOT NULL,
    action text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "PK_contributions" PRIMARY KEY (contribution_id),
    CONSTRAINT "FK_contributor_id" FOREIGN KEY (contributed_by)
        REFERENCES contributors (contributor_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.contributions
    OWNER to postgres;