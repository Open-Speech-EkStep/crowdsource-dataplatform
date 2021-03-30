/* Replace with your SQL commands */
insert into reward_catalogue (type) values ('badge');
insert into reward_catalogue (type, grade) values ('badge', 'bronze');
insert into reward_catalogue (type, grade) values ('badge', 'silver');
insert into reward_catalogue (type, grade) values ('badge', 'gold');
insert into reward_catalogue (type, grade) values ('badge', 'platinum');

insert into reward_milestones (milestone, language, reward_catalogue_id) select 5, 'Hindi' as language, id from reward_catalogue where grade IS null;
insert into reward_milestones (milestone, language, reward_catalogue_id) select 15, 'Hindi' as language, id from reward_catalogue where grade IS null;
insert into reward_milestones (milestone, language, reward_catalogue_id) select 25, 'Hindi' as language, id from reward_catalogue where grade = 'bronze';
insert into reward_milestones (milestone, language, reward_catalogue_id) select 50, 'Hindi' as language, id from reward_catalogue where grade = 'silver';
insert into reward_milestones (milestone, language, reward_catalogue_id) select 100, 'Hindi' as language, id from reward_catalogue where grade = 'gold';
insert into reward_milestones (milestone, language, reward_catalogue_id) select 200, 'Hindi' as language, id from reward_catalogue where grade = 'platinum';

insert into reward_milestones (milestone, language, reward_catalogue_id) select distinct(milestone), 'English' as language, reward_catalogue_id from reward_milestones;
insert into reward_milestones (milestone, language, reward_catalogue_id) select distinct(milestone), 'Tamil' as language, reward_catalogue_id from reward_milestones;
insert into reward_milestones (milestone, language, reward_catalogue_id) select distinct(milestone), 'Malayalam' as language, reward_catalogue_id from reward_milestones;
insert into reward_milestones (milestone, language, reward_catalogue_id) select distinct(milestone), 'Odia' as language, reward_catalogue_id from reward_milestones;
insert into reward_milestones (milestone, language, reward_catalogue_id) select distinct(milestone), 'Bengali' as language, reward_catalogue_id from reward_milestones;
insert into reward_milestones (milestone, language, reward_catalogue_id) select distinct(milestone), 'Assamese' as language, reward_catalogue_id from reward_milestones;
insert into reward_milestones (milestone, language, reward_catalogue_id) select distinct(milestone), 'Telugu' as language, reward_catalogue_id from reward_milestones;
insert into reward_milestones (milestone, language, reward_catalogue_id) select distinct(milestone), 'Kannada' as language, reward_catalogue_id from reward_milestones;
insert into reward_milestones (milestone, language, reward_catalogue_id) select distinct(milestone), 'Gujarati' as language, reward_catalogue_id from reward_milestones;
insert into reward_milestones (milestone, language, reward_catalogue_id) select distinct(milestone), 'Marathi' as language, reward_catalogue_id from reward_milestones;
insert into reward_milestones (milestone, language, reward_catalogue_id) select distinct(milestone), 'Punjabi' as language, reward_catalogue_id from reward_milestones;
insert into reward_milestones (milestone, language, reward_catalogue_id) select distinct(milestone), 'Sankskrit' as language, reward_catalogue_id from reward_milestones;
insert into reward_milestones (milestone, language, reward_catalogue_id) select distinct(milestone), 'Nepali' as language, reward_catalogue_id from reward_milestones;
insert into reward_milestones (milestone, language, reward_catalogue_id) select distinct(milestone), 'Kashmiri' as language, reward_catalogue_id from reward_milestones;
insert into reward_milestones (milestone, language, reward_catalogue_id) select distinct(milestone), 'Maithili' as language, reward_catalogue_id from reward_milestones;
insert into reward_milestones (milestone, language, reward_catalogue_id) select distinct(milestone), 'Bodo' as language, reward_catalogue_id from reward_milestones;
insert into reward_milestones (milestone, language, reward_catalogue_id) select distinct(milestone), 'Dogri' as language, reward_catalogue_id from reward_milestones;
insert into reward_milestones (milestone, language, reward_catalogue_id) select distinct(milestone), 'Sindhi' as language, reward_catalogue_id from reward_milestones;
insert into reward_milestones (milestone, language, reward_catalogue_id) select distinct(milestone), 'Urdu' as language, reward_catalogue_id from reward_milestones;
