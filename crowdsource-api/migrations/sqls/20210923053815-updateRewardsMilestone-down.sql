/* Replace with your SQL commands */
update reward_milestones set milestone=100 where reward_catalogue_id in (select id from reward_catalogue where grade='Gold');

update reward_milestones set milestone=200 where reward_catalogue_id in (select id from reward_catalogue where grade='Platinum');