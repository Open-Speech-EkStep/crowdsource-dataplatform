/* Replace with your SQL commands */
ALTER TABLE public.rewards
    ADD COLUMN language text;

update rewards set language = rm.language 
from reward_milestones rm where rewards.milestone_id = rm.milestone_id;

ALTER TABLE public.rewards
    ADD COLUMN category text NOT NULL DEFAULT 'speak';

ALTER TABLE public.rewards 
    ADD COLUMN reward_catalogue_id integer;

update rewards set reward_catalogue_id = rm.reward_catalogue_id 
from reward_milestones rm rewards.milestone_id = rm.milestone_id;

ALTER TABLE rewards 
ALTER COLUMN reward_catalogue_id 
SET NOT NULL;

ALTER TABLE rewards 
    ADD CONSTRAINT "FK_reward_catalogue_id" FOREIGN KEY (reward_catalogue_id)
    REFERENCES reward_catalogue (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE rewards
    DROP COLUMN milestone_id;
