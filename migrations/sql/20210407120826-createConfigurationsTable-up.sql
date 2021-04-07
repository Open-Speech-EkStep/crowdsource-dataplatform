CREATE TABLE public.configurations
(
    config_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    config_name text COLLATE pg_catalog."default" NOT NULL,
    value integer NOT NULL,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT configuration_pkey PRIMARY KEY (config_id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.configurations
    OWNER to postgres;

insert into configurations(config_name, value, updated_by) values ('validation_count', 3 , 'Admin')