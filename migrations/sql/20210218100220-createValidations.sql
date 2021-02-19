CREATE TABLE public.validations
(
    validation_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    contribution_id integer NOT NULL,
    action text COLLATE pg_catalog."default" NOT NULL,
    validated_by text COLLATE pg_catalog."default" NOT NULL,
    date date NOT NULL,
    CONSTRAINT "validations_pkey" PRIMARY KEY (validation_id),
    CONSTRAINT "FK_contribution_id" FOREIGN KEY (contribution_id)
        REFERENCES contributions (contribution_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.validations
    OWNER to postgres;


GRANT UPDATE, INSERT, SELECT ON TABLE public.validations TO crowdsourcedbuser;

GRANT ALL ON TABLE public.validations TO postgres;