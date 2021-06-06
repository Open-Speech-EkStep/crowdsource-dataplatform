/* Replace with your SQL commands */
ALTER TABLE language_goals
    DROP COLUMN type;

ALTER TABLE language_goals
    DROP COLUMN category;

ALTER TABLE language_goals RENAME TO language_milestones;

UPDATE language_milestones SET language=LOWER(language);

ALTER TABLE language_milestones
    RENAME goal TO milestone_multiplier;

delete from language_milestones where language in ('sankskrit','nepali', 'kashmiri', 'maithili', 'bodo', 'dogri', 'sindhi', 'urdu');
    