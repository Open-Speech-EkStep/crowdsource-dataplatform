/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS public.rewards
(
    reward_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    contributor_id integer NOT NULL,
    category text,
    language text,
    reward_catalogue_id integer NOT NULL,
    generated_at timestamp with time zone NOT NULL DEFAULT current_timestamp,
    CONSTRAINT "PK_reward_id" PRIMARY KEY (reward_id),
    CONSTRAINT "FK_reward_catalogue_id" FOREIGN KEY (reward_catalogue_id)
    REFERENCES reward_catalogue (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
);