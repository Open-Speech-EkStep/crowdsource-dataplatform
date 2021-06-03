/* Replace with your SQL commands */
delete from reward_milestones where milestone=15 or milestone=25 

update reward_catalogue set grade='Bronze' where grade='bronze'
update reward_catalogue set grade='Silver' where grade='silver'
update reward_catalogue set grade='Gold' where grade='gold'
update reward_catalogue set grade='Platinum' where grade='platinum'

update reward_milestones set reward_catalogue_id=(select id from reward_catalogue where grade='Bronze') where milestone=5;
update reward_milestones set reward_catalogue_id=(select id from reward_catalogue where grade='Silver') where milestone=50;
update reward_milestones set reward_catalogue_id=(select id from reward_catalogue where grade='Gold') where milestone=100;
update reward_milestones set reward_catalogue_id=(select id from reward_catalogue where grade='Platinum') where milestone=200;
