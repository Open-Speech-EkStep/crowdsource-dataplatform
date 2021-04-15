/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS public.reward_milestones
(
    milestone_id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    milestone integer NOT NULL,
    language text NOT NULL,
    reward_catalogue_id integer NOT NULL,
    CONSTRAINT "PK_reward_milestones" PRIMARY KEY (milestone_id),
    CONSTRAINT "FK_reward_catalogue_id" FOREIGN KEY (reward_catalogue_id)
        REFERENCES reward_catalogue (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);