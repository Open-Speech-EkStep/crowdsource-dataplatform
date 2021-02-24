-- Table: public.sentences

-- DROP TABLE public.sentences;

CREATE TABLE  IF NOT EXISTS public.sentences
(
    "sentenceId" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    sentence text COLLATE pg_catalog."default",
    assign boolean NOT NULL DEFAULT false,
    "fileName" text COLLATE pg_catalog."default",
    "userId" text COLLATE pg_catalog."default",
    "assignDate" date,
    "userName" text COLLATE pg_catalog."default",
    "ageGroup" text COLLATE pg_catalog."default",
    gender text COLLATE pg_catalog."default",
    "motherTongue" text COLLATE pg_catalog."default",
    label text COLLATE pg_catalog."default" NOT NULL DEFAULT 'hard'::text,
    language text COLLATE pg_catalog."default",
    CONSTRAINT sentences_pkey PRIMARY KEY ("sentenceId")
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.sentences
    OWNER to postgres;

GRANT UPDATE, INSERT, SELECT ON TABLE public.sentences TO crowdsourcedbuser;

GRANT ALL ON TABLE public.sentences TO postgres;
-- Index: language

-- DROP INDEX public.language;

CREATE INDEX  IF NOT EXISTS language
    ON public.sentences USING btree
    (language COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: sentenceid

-- DROP INDEX public.sentenceid;

CREATE INDEX  IF NOT EXISTS sentenceid
    ON public.sentences USING btree
    ("sentenceId" ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: sentences_filename

-- DROP INDEX public.sentences_filename;

-- CREATE INDEX  IF NOT EXISTS sentences_filename
--     ON public.sentences USING btree
--     ("fileName" COLLATE pg_catalog."default" ASC NULLS LAST)
--     TABLESPACE pg_default;
-- Index: sentences_userid

-- DROP INDEX public.sentences_userid;

-- CREATE INDEX  IF NOT EXISTS sentences_userid
--     ON public.sentences USING btree
--     ("userId" COLLATE pg_catalog."default" ASC NULLS LAST)
--     TABLESPACE pg_default;
-- Index: sentences_username

-- DROP INDEX public.sentences_username;

-- CREATE INDEX  IF NOT EXISTS sentences_username
    -- ON public.sentences USING btree
    -- ("userName" COLLATE pg_catalog."default" ASC NULLS LAST)
    -- TABLESPACE pg_default;

-- Trigger: insert_sentences_trigger

-- DROP TRIGGER insert_sentences_trigger ON public.sentences;

-- CREATE TRIGGER  IF NOT EXISTS insert_sentences_trigger
--     BEFORE INSERT
--     ON public.sentences
--     FOR EACH ROW
--     EXECUTE PROCEDURE public.sentences_insert_trigger();


    -- Table: public.odia_sentences

-- DROP TABLE public.odia_sentences;

CREATE TABLE  IF NOT EXISTS public.odia_sentences
(
    -- Inherited from table public.sentences: "sentenceId" integer NOT NULL,
    -- Inherited from table public.sentences: sentence text COLLATE pg_catalog."default",
    -- Inherited from table public.sentences: assign boolean NOT NULL DEFAULT false,
    -- Inherited from table public.sentences: "fileName" text COLLATE pg_catalog."default",
    -- Inherited from table public.sentences: "userId" text COLLATE pg_catalog."default",
    -- Inherited from table public.sentences: "assignDate" date,
    -- Inherited from table public.sentences: "userName" text COLLATE pg_catalog."default",
    -- Inherited from table public.sentences: "ageGroup" text COLLATE pg_catalog."default",
    -- Inherited from table public.sentences: gender text COLLATE pg_catalog."default",
    -- Inherited from table public.sentences: "motherTongue" text COLLATE pg_catalog."default",
    -- Inherited from table public.sentences: label text COLLATE pg_catalog."default" NOT NULL DEFAULT 'hard'::text,
    -- Inherited from table public.sentences: language text COLLATE pg_catalog."default",
    CONSTRAINT odia_sentences_language_check CHECK (language = 'Odia'::text)
)
    INHERITS (public.sentences)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.odia_sentences
    OWNER to postgres;


-- Table: public.gujarati_sentences

-- DROP TABLE public.gujarati_sentences;

CREATE TABLE  IF NOT EXISTS public.gujarati_sentences
(
    -- Inherited from table public.sentences: "sentenceId" integer NOT NULL,
    -- Inherited from table public.sentences: sentence text COLLATE pg_catalog."default",
    -- Inherited from table public.sentences: assign boolean NOT NULL DEFAULT false,
    -- Inherited from table public.sentences: "fileName" text COLLATE pg_catalog."default",
    -- Inherited from table public.sentences: "userId" text COLLATE pg_catalog."default",
    -- Inherited from table public.sentences: "assignDate" date,
    -- Inherited from table public.sentences: "userName" text COLLATE pg_catalog."default",
    -- Inherited from table public.sentences: "ageGroup" text COLLATE pg_catalog."default",
    -- Inherited from table public.sentences: gender text COLLATE pg_catalog."default",
    -- Inherited from table public.sentences: "motherTongue" text COLLATE pg_catalog."default",
    -- Inherited from table public.sentences: label text COLLATE pg_catalog."default" NOT NULL DEFAULT 'hard'::text,
    -- Inherited from table public.sentences: language text COLLATE pg_catalog."default",
    CONSTRAINT gujarati_sentences_language_check CHECK (language = 'Gujarati'::text)
)
    INHERITS (public.sentences)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.gujarati_sentences
    OWNER to postgres;