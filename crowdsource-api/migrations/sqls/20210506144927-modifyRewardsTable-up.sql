-- Replace with your SQL commands
ALTER TABLE rewards
    ADD COLUMN milestone_id integer;

update rewards set milestone_id = rm.milestone_id 
from reward_milestones rm where LOWER(rewards.language) = LOWER(rm.language) 
and rewards.reward_catalogue_id = rm.reward_catalogue_id;

ALTER TABLE rewards 
ALTER COLUMN milestone_id 
SET NOT NULL;

ALTER TABLE rewards 
    ADD CONSTRAINT "FK_milestone_id" FOREIGN KEY (milestone_id)
    REFERENCES reward_milestones (milestone_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE public.rewards 
    DROP COLUMN reward_catalogue_id;

ALTER TABLE public.rewards
    DROP COLUMN category;

ALTER TABLE public.rewards
    DROP COLUMN language;
