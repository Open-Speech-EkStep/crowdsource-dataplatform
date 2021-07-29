CREATE TABLE IF NOT EXISTS public.feedbacks
(
    feedback_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    feedback text COLLATE pg_catalog."default",
    subject text COLLATE pg_catalog."default",
    language text COLLATE pg_catalog."default",
    feedback_date date DEFAULT CURRENT_TIMESTAMP(2),
    CONSTRAINT "feedback_pkey" PRIMARY KEY (feedback_id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.feedbacks
    OWNER to postgres;


GRANT ALL ON TABLE public.contributors TO postgres;