/* Replace with your SQL commands */
insert into language_milestones (language, milestone_multiplier) values ('sankskrit', 100);
insert into language_milestones (language, milestone_multiplier) values ('nepali', 100);
insert into language_milestones (language, milestone_multiplier) values ('kashmiri', 100);
insert into language_milestones (language, milestone_multiplier) values ('maithili', 100);
insert into language_milestones (language, milestone_multiplier) values ('bodo', 100);
insert into language_milestones (language, milestone_multiplier) values ('dogri', 100);
insert into language_milestones (language, milestone_multiplier) values ('sindhi', 100);
insert into language_milestones (language, milestone_multiplier) values ('urdu', 100);

ALTER TABLE language_milestones RENAME TO language_goals;

UPDATE language_goals SET language=INITCAP(language);

ALTER TABLE language_goals
    RENAME milestone_multiplier TO goal;

ALTER TABLE language_goals
    ADD COLUMN type text NOT NULL DEFAULT 'text';

ALTER TABLE language_goals
    ADD COLUMN category text NOT NULL DEFAULT 'contribute';
