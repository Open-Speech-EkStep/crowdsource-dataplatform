CREATE TABLE public.contributors
(
    contributor_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    mother_tongue text COLLATE pg_catalog."default",
    gender text COLLATE pg_catalog."default",
    age_group text COLLATE pg_catalog."default",
    user_name text COLLATE pg_catalog."default",
    contributor_identifier text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "contributors_pkey" PRIMARY KEY (contributor_id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.contributors
    OWNER to postgres;

GRANT UPDATE, INSERT, SELECT ON TABLE public.contributors TO crowdsourcedbuser;

GRANT ALL ON TABLE public.contributors TO postgres;