/* Replace with your SQL commands */

DROP MATERIALIZED VIEW IF EXISTS contributions_and_demo_stats CASCADE;


CREATE MATERIALIZED VIEW IF NOT EXISTS contributions_and_demo_stats AS (
SELECT contributions.contributed_by,
			contributions.contribution_id,
			validations.validation_id,
 			contributions.date,
			COALESCE(contributors.gender,'ANONYMOUS'::text) as gender,
			COALESCE(contributors.age_group,'ANONYMOUS'::text) as age_group,
			COALESCE(contributors.mother_tongue,'ANONYMOUS'::text) as mother_tongue,
			COALESCE(contributions.state_region,'ANONYMOUS'::text) as state_region,
			sentences.language,
			contributions."sentenceId",
			CASE WHEN validations.action = ANY (ARRAY['accept'::text, 'reject'::text]) THEN 1::bigint
                    ELSE 0::bigint
                END AS is_validated
           FROM contributions 
           	 LEFT JOIN validations  ON contributions.contribution_id = validations.contribution_id
             JOIN sentences ON sentences."sentenceId" = contributions."sentenceId"
             LEFT JOIN contributors ON contributors.contributor_id = contributions.contributed_by
          WHERE contributions.action = 'completed'::text AND contributions.date >= (CURRENT_DATE - '1 year'::interval)
		  ORDER BY contributions.contributed_by);

REFRESH MATERIALIZED VIEW contributions_and_demo_stats;


CREATE MATERIALIZED VIEW IF NOT EXISTS daily_stats_complete AS (
select language,date_part('year'::text, date) AS year,
    date_part('month'::text, date) AS month,
    date_part('day'::text, date) AS day,count(distinct(contribution_id)) as total_contributions,sum(is_validated)  as total_validations from contributions_and_demo_stats group by date,language ORDER BY date  );

REFRESH MATERIALIZED VIEW daily_stats_complete;