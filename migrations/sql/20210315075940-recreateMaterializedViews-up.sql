/* Replace with your SQL commands */

DROP MATERIALIZED VIEW IF EXISTS contributions_and_demo_stats CASCADE;

CREATE MATERIALIZED VIEW contributions_and_demo_stats AS (
  SELECT contributions.contributed_by,
    contributions.contribution_id,
    validations.validation_id,
    contributions.date,
    COALESCE(contributors.gender, 'ANONYMOUS'::text) AS gender,
    COALESCE(contributors.age_group, 'ANONYMOUS'::text) AS age_group,
    COALESCE(contributors.mother_tongue, 'ANONYMOUS'::text) AS mother_tongue,
    COALESCE(contributions.state_region, 'ANONYMOUS'::text) AS contributions_state_region,
    COALESCE(validations.state_region, 'ANONYMOUS'::text) AS validations_state_region,
    COALESCE(contributions.audio_duration, 0::double precision) AS contribution_audio_duration,
    ROW_NUMBER() OVER (PARTITION BY contributions.contribution_id ORDER BY contributions.audio_duration DESC) as audio_row_num_per_contribution_id,
    sentences.language,
    contributions."sentenceId",
        CASE
            WHEN validations.action = ANY (ARRAY['accept'::text, 'reject'::text]) THEN 1::bigint
            ELSE 0::bigint
        END AS is_validated,
        CASE
            WHEN validations.action = ANY (ARRAY['accept'::text, 'reject'::text]) THEN COALESCE(contributions.audio_duration, 0::double precision)
            ELSE 0::bigint::double precision
        END AS validation_audio_duration
   FROM contributions
     LEFT JOIN validations ON contributions.contribution_id = validations.contribution_id
     JOIN sentences ON sentences."sentenceId" = contributions."sentenceId"
     LEFT JOIN contributors ON contributors.contributor_id = contributions.contributed_by
  WHERE contributions.action = 'completed'::text AND contributions.date >= (CURRENT_DATE - '1 year'::interval)
  ORDER BY contributions.contributed_by);


REFRESH MATERIALIZED VIEW contributions_and_demo_stats;

CREATE MATERIALIZED VIEW daily_stats_complete AS (
 SELECT contributions_and_demo_stats.language,
    date_part('year'::text, contributions_and_demo_stats.date) AS year,
    date_part('month'::text, contributions_and_demo_stats.date) AS month,
    date_part('day'::text, contributions_and_demo_stats.date) AS day,
    round((sum(contributions_and_demo_stats.contribution_audio_duration) FILTER (WHERE audio_row_num_per_contribution_id = 1 ))::numeric,3) AS total_contribution_duration,
    round(sum(contributions_and_demo_stats.validation_audio_duration)::numeric, 3) AS total_validation_duration,
    count(DISTINCT contributions_and_demo_stats.contribution_id) AS total_contributions,
    sum(contributions_and_demo_stats.is_validated) AS total_validations
   FROM contributions_and_demo_stats
  GROUP BY contributions_and_demo_stats.date, contributions_and_demo_stats.language
  ORDER BY contributions_and_demo_stats.date);  



REFRESH MATERIALIZED VIEW daily_stats_complete;