/* Replace with your SQL commands */

CREATE TABLE IF NOT EXISTS public.language_milestones
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    milestone_multiplier integer NOT NULL,
    language text NOT NULL,
    PRIMARY KEY (id)
)