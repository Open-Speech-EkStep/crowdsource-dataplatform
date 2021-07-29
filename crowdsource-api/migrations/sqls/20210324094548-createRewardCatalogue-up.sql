/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS public.reward_catalogue
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    type text NOT NULL,
    grade text,
    message text,
    PRIMARY KEY (id)
)