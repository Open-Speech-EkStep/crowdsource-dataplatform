/* Replace with your SQL commands */
CREATE TABLE  IF NOT EXISTS public.users
(
    "id" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    username text NOT NULL,
    role text NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY ("id")
);