CREATE MATERIALIZED VIEW public.contributions_and_demo_stats_newest
TABLESPACE pg_default
AS
 SELECT contributions.contributed_by,
    contributions.contribution_id,
    validations.validation_id,
    contributions.date,
    COALESCE(contributors.gender, 'ANONYMOUS'::text) AS gender,
    COALESCE(contributors.age_group, 'ANONYMOUS'::text) AS age_group,
    COALESCE(contributors.mother_tongue, 'ANONYMOUS'::text) AS mother_tongue,
    COALESCE(contributions.state_region, 'ANONYMOUS'::text) AS contributions_state_region,
    COALESCE(validations.state_region, 'ANONYMOUS'::text) AS validations_state_region,
        CASE
            WHEN dataset_row.type = 'text'::text THEN COALESCE((contributions.media ->> 'duration'::text)::double precision, 0::double precision)
            ELSE COALESCE((dataset_row.media ->> 'duration'::text)::double precision, 0::double precision)
        END AS contribution_audio_duration,
    row_number() OVER (PARTITION BY contributions.contribution_id ORDER BY contributions.audio_duration DESC) AS audio_row_num_per_contribution_id,
        CASE
            WHEN dataset_row.type = 'parallel'::text THEN ((dataset_row.media ->> 'language'::text) || '-'::text) || (contributions.media ->> 'language'::text)
            ELSE dataset_row.media ->> 'language'::text
        END AS language,
    contributions.dataset_row_id AS "sentenceId",
        CASE
            WHEN validations.action = ANY (ARRAY['accept'::text, 'reject'::text]) THEN 1::bigint
            ELSE 0::bigint
        END AS is_validated,
        CASE
            WHEN validations.action = ANY (ARRAY['accept'::text, 'reject'::text]) THEN COALESCE(contributions.audio_duration, 0::double precision)
            ELSE 0::bigint::double precision
        END AS validation_audio_duration,
    dataset_row.type
   FROM contributions
     LEFT JOIN validations ON contributions.contribution_id = validations.contribution_id
     JOIN dataset_row ON dataset_row.dataset_row_id = contributions.dataset_row_id
     LEFT JOIN contributors ON contributors.contributor_id = contributions.contributed_by
  WHERE contributions.action = 'completed'::text AND contributions.date >= (CURRENT_DATE - '1 year'::interval)
  ORDER BY contributions.contributed_by;


ALTER TABLE public.contributions_and_demo_stats_newest
    OWNER TO postgres;



CREATE MATERIALIZED VIEW public.daily_stats_complete_newest
TABLESPACE pg_default
AS
 SELECT contributions_and_demo_stats.language,
    date_part('year'::text, contributions_and_demo_stats.date) AS year,
    date_part('month'::text, contributions_and_demo_stats.date) AS month,
    date_part('day'::text, contributions_and_demo_stats.date) AS day,
    round(sum(contributions_and_demo_stats.contribution_audio_duration) FILTER (WHERE contributions_and_demo_stats.audio_row_num_per_contribution_id = 1)::numeric, 3) AS total_contribution_duration,
    round(sum(contributions_and_demo_stats.validation_audio_duration)::numeric, 3) AS total_validation_duration,
    count(DISTINCT contributions_and_demo_stats.contribution_id) AS total_contributions,
    sum(contributions_and_demo_stats.is_validated) AS total_validations,
    contributions_and_demo_stats.type
   FROM contributions_and_demo_stats_newest contributions_and_demo_stats
  GROUP BY contributions_and_demo_stats.date, contributions_and_demo_stats.language, contributions_and_demo_stats.type
  ORDER BY contributions_and_demo_stats.date
WITH DATA;

ALTER TABLE public.daily_stats_complete_newest
    OWNER TO postgres;

DROP MATERIALIZED VIEW public.age_group_contributions;

CREATE MATERIALIZED VIEW public.age_group_contributions
TABLESPACE pg_default
AS
 SELECT contributions_and_demo_stats.age_group,
    count(*) AS contributions,
    sum(contributions_and_demo_stats.contribution_audio_duration) AS hours_contributed,
    sum(contributions_and_demo_stats.validation_audio_duration) AS hours_validated,
    count(DISTINCT contributions_and_demo_stats.contributed_by) AS speakers
   FROM contributions_and_demo_stats_newest contributions_and_demo_stats
  GROUP BY contributions_and_demo_stats.age_group
  ORDER BY (count(*)) DESC
WITH DATA;

ALTER TABLE public.age_group_contributions
    OWNER TO postgres;


DROP MATERIALIZED VIEW public.gender_group_contributions;

CREATE MATERIALIZED VIEW public.gender_group_contributions
TABLESPACE pg_default
AS
 SELECT contributions_and_demo_stats.gender,
    count(*) AS contributions,
    sum(contributions_and_demo_stats.contribution_audio_duration) AS hours_contributed,
    sum(contributions_and_demo_stats.validation_audio_duration) AS hours_validated,
    count(DISTINCT contributions_and_demo_stats.contributed_by) AS speakers
   FROM contributions_and_demo_stats_newest contributions_and_demo_stats
  GROUP BY contributions_and_demo_stats.gender
  ORDER BY (count(*)) DESC
WITH DATA;

ALTER TABLE public.gender_group_contributions
    OWNER TO postgres;

DROP MATERIALIZED VIEW public.language_and_state_group_contributions;

CREATE MATERIALIZED VIEW public.language_and_state_group_contributions
TABLESPACE pg_default
AS
 SELECT COALESCE(cs.state, vs.state) AS state,
    COALESCE(cs.language, vs.language) AS language,
    cs.total_speakers,
    cs.total_contributions,
    vs.total_validations,
    cs.total_contribution_count,
    vs.total_validation_count,
    cs.type
   FROM ( SELECT contributions_and_demo_stats.contributions_state_region AS state,
            contributions_and_demo_stats.language,
            count(DISTINCT contributions_and_demo_stats.contributed_by) AS total_speakers,
            sum(contributions_and_demo_stats.contribution_audio_duration) FILTER (WHERE contributions_and_demo_stats.audio_row_num_per_contribution_id = 1) AS total_contributions,
            contributions_and_demo_stats.type,
            count(DISTINCT contributions_and_demo_stats.contribution_id) AS total_contribution_count
           FROM contributions_and_demo_stats_newest contributions_and_demo_stats
          GROUP BY contributions_and_demo_stats.type, contributions_and_demo_stats.contributions_state_region, contributions_and_demo_stats.language) cs
     FULL JOIN ( SELECT contributions_and_demo_stats.validations_state_region AS state,
            contributions_and_demo_stats.language,
            round(sum(contributions_and_demo_stats.validation_audio_duration)::numeric / 3600::numeric, 3) AS total_validations,
            contributions_and_demo_stats.type,
            sum(contributions_and_demo_stats.is_validated) AS total_validation_count
           FROM contributions_and_demo_stats_newest contributions_and_demo_stats
          GROUP BY contributions_and_demo_stats.type, contributions_and_demo_stats.validations_state_region, contributions_and_demo_stats.language) vs ON cs.state = vs.state AND cs.language = vs.language AND cs.type = vs.type
WITH DATA;

ALTER TABLE public.language_and_state_group_contributions
    OWNER TO postgres;

DROP MATERIALIZED VIEW public.language_group_contributions;

CREATE MATERIALIZED VIEW public.language_group_contributions
TABLESPACE pg_default
AS
 SELECT contributions_and_demo_stats.language,
    count(DISTINCT contributions_and_demo_stats.contributed_by) AS total_speakers,
    sum(contributions_and_demo_stats.contribution_audio_duration) FILTER (WHERE contributions_and_demo_stats.audio_row_num_per_contribution_id = 1) AS total_contributions,
    sum(contributions_and_demo_stats.validation_audio_duration) AS total_validations,
    contributions_and_demo_stats.type,
    count(DISTINCT contributions_and_demo_stats.contribution_id) AS total_contribution_count,
    sum(contributions_and_demo_stats.is_validated) AS total_validation_count
   FROM contributions_and_demo_stats_newest contributions_and_demo_stats
  GROUP BY contributions_and_demo_stats.type, contributions_and_demo_stats.language
WITH DATA;

ALTER TABLE public.language_group_contributions
    OWNER TO postgres;

DROP MATERIALIZED VIEW public.state_group_contributions;

CREATE MATERIALIZED VIEW public.state_group_contributions
TABLESPACE pg_default
AS
 SELECT COALESCE(contribution_by_state.state, validation_by_state.state) AS state,
    contribution_by_state.total_speakers,
    contribution_by_state.total_contributions,
    validation_by_state.total_validations,
    contribution_by_state.type,
    contribution_by_state.total_contribution_count,
    validation_by_state.total_validation_count
   FROM ( SELECT contributions_and_demo_stats.contributions_state_region AS state,
            count(DISTINCT contributions_and_demo_stats.contributed_by) AS total_speakers,
            round(sum(contributions_and_demo_stats.contribution_audio_duration) FILTER (WHERE contributions_and_demo_stats.audio_row_num_per_contribution_id = 1)::numeric / 3600::numeric, 3) AS total_contributions,
            contributions_and_demo_stats.type,
            count(DISTINCT contributions_and_demo_stats.contribution_id) AS total_contribution_count
           FROM contributions_and_demo_stats_newest contributions_and_demo_stats
          GROUP BY contributions_and_demo_stats.type, contributions_and_demo_stats.contributions_state_region) contribution_by_state
     FULL JOIN ( SELECT contributions_and_demo_stats.validations_state_region AS state,
            round(sum(contributions_and_demo_stats.validation_audio_duration)::numeric / 3600::numeric, 3) AS total_validations,
            contributions_and_demo_stats.type,
            sum(contributions_and_demo_stats.is_validated) AS total_validation_count
           FROM contributions_and_demo_stats_newest contributions_and_demo_stats
          GROUP BY contributions_and_demo_stats.type, contributions_and_demo_stats.validations_state_region) validation_by_state ON contribution_by_state.state = validation_by_state.state AND contribution_by_state.type = validation_by_state.type
WITH DATA;

ALTER TABLE public.state_group_contributions
    OWNER TO postgres;

CREATE OR REPLACE VIEW public.daily_cumulative_stats_all
 AS
 WITH daily_stats_all AS (
         SELECT daily_stats_complete.year,
            daily_stats_complete.month,
            daily_stats_complete.day,
            sum(daily_stats_complete.total_contributions) AS total_contributions,
            sum(daily_stats_complete.total_validations) AS total_validations,
            sum(daily_stats_complete.total_contribution_duration) AS total_contribution_duration,
            sum(daily_stats_complete.total_validation_duration) AS total_validation_duration,
            daily_stats_complete.type
           FROM daily_stats_complete_newest daily_stats_complete
          GROUP BY daily_stats_complete.type, daily_stats_complete.year, daily_stats_complete.month, daily_stats_complete.day
          ORDER BY daily_stats_complete.year, daily_stats_complete.month, daily_stats_complete.day
        )
 SELECT daily_stats_all.year,
    daily_stats_all.month,
    daily_stats_all.day,
    sum(daily_stats_all.total_contributions) OVER (PARTITION BY daily_stats_all.type ORDER BY daily_stats_all.year, daily_stats_all.month, daily_stats_all.day ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_contributions,
    sum(daily_stats_all.total_validations) OVER (PARTITION BY daily_stats_all.type ORDER BY daily_stats_all.year, daily_stats_all.month, daily_stats_all.day ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_validations,
    sum(daily_stats_all.total_contribution_duration) OVER (PARTITION BY daily_stats_all.type ORDER BY daily_stats_all.year, daily_stats_all.month, daily_stats_all.day ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_contribution_duration,
    sum(daily_stats_all.total_validation_duration) OVER (PARTITION BY daily_stats_all.type ORDER BY daily_stats_all.year, daily_stats_all.month, daily_stats_all.day ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_validation_duration,
    daily_stats_all.type
   FROM daily_stats_all;

CREATE OR REPLACE VIEW public.daily_cumulative_stats_per_language
 AS
 SELECT daily_stats_complete.language,
    daily_stats_complete.year,
    daily_stats_complete.month,
    daily_stats_complete.day,
    sum(daily_stats_complete.total_contributions) OVER (PARTITION BY daily_stats_complete.language, daily_stats_complete.type ORDER BY daily_stats_complete.year, daily_stats_complete.month, daily_stats_complete.day ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_contributions,
    sum(daily_stats_complete.total_validations) OVER (PARTITION BY daily_stats_complete.language, daily_stats_complete.type ORDER BY daily_stats_complete.year, daily_stats_complete.month, daily_stats_complete.day ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_validations,
    sum(daily_stats_complete.total_contribution_duration) OVER (PARTITION BY daily_stats_complete.language, daily_stats_complete.type ORDER BY daily_stats_complete.year, daily_stats_complete.month, daily_stats_complete.day ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_contribution_duration,
    sum(daily_stats_complete.total_validation_duration) OVER (PARTITION BY daily_stats_complete.language, daily_stats_complete.type ORDER BY daily_stats_complete.year, daily_stats_complete.month, daily_stats_complete.day ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_validation_duration,
    daily_stats_complete.type
   FROM daily_stats_complete_newest daily_stats_complete;

CREATE OR REPLACE VIEW public.monthly_stats_complete
 AS
 SELECT daily_stats_complete.language,
    daily_stats_complete.year,
    daily_stats_complete.month,
    sum(daily_stats_complete.total_contributions) AS total_contributions,
    sum(daily_stats_complete.total_validations) AS total_validations,
    sum(daily_stats_complete.total_contribution_duration) AS total_contribution_duration,
    sum(daily_stats_complete.total_validation_duration) AS total_validation_duration,
    daily_stats_complete.type
   FROM daily_stats_complete_newest daily_stats_complete
  GROUP BY daily_stats_complete.type, daily_stats_complete.language, daily_stats_complete.year, daily_stats_complete.month;

CREATE OR REPLACE VIEW public.monthly_cumulative_stats_all
 AS
 WITH monthly_stats_all AS (
         SELECT monthly_stats_complete.year,
            monthly_stats_complete.month,
            sum(monthly_stats_complete.total_contributions) AS total_contributions,
            sum(monthly_stats_complete.total_validations) AS total_validations,
            sum(monthly_stats_complete.total_contribution_duration) AS total_contribution_duration,
            sum(monthly_stats_complete.total_validation_duration) AS total_validation_duration,
            monthly_stats_complete.type
           FROM monthly_stats_complete
          GROUP BY monthly_stats_complete.type, monthly_stats_complete.year, monthly_stats_complete.month
          ORDER BY monthly_stats_complete.year, monthly_stats_complete.month
        )
 SELECT monthly_stats_all.year,
    monthly_stats_all.month,
    sum(monthly_stats_all.total_contributions) OVER (PARTITION BY monthly_stats_all.type ORDER BY monthly_stats_all.year, monthly_stats_all.month ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_contributions,
    sum(monthly_stats_all.total_validations) OVER (PARTITION BY monthly_stats_all.type ORDER BY monthly_stats_all.year, monthly_stats_all.month ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_validations,
    sum(monthly_stats_all.total_contribution_duration) OVER (PARTITION BY monthly_stats_all.type ORDER BY monthly_stats_all.year, monthly_stats_all.month ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_contribution_duration,
    sum(monthly_stats_all.total_validation_duration) OVER (PARTITION BY monthly_stats_all.type ORDER BY monthly_stats_all.year, monthly_stats_all.month ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_validation_duration,
    monthly_stats_all.type
   FROM monthly_stats_all;

 CREATE OR REPLACE VIEW public.monthly_cumulative_stats_per_language
 AS
 SELECT monthly_stats_complete.language,
    monthly_stats_complete.year,
    monthly_stats_complete.month,
    sum(monthly_stats_complete.total_contributions) OVER (PARTITION BY monthly_stats_complete.language, monthly_stats_complete.type ORDER BY monthly_stats_complete.year, monthly_stats_complete.month ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_contributions,
    sum(monthly_stats_complete.total_validations) OVER (PARTITION BY monthly_stats_complete.language, monthly_stats_complete.type ORDER BY monthly_stats_complete.year, monthly_stats_complete.month ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_validations,
    sum(monthly_stats_complete.total_contribution_duration) OVER (PARTITION BY monthly_stats_complete.language, monthly_stats_complete.type ORDER BY monthly_stats_complete.year, monthly_stats_complete.month ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_contribution_duration,
    sum(monthly_stats_complete.total_validation_duration) OVER (PARTITION BY monthly_stats_complete.language, monthly_stats_complete.type ORDER BY monthly_stats_complete.year, monthly_stats_complete.month ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_validation_duration,
    monthly_stats_complete.type
   FROM monthly_stats_complete;


 CREATE OR REPLACE VIEW public.quarterly_stats_complete
 AS
 SELECT daily_stats_complete.language,
    daily_stats_complete.year,
    date_part('quarter'::text, concat(daily_stats_complete.year, '-', daily_stats_complete.month, '-', daily_stats_complete.day)::date) AS quarter,
    sum(daily_stats_complete.total_contributions) AS total_contributions,
    sum(daily_stats_complete.total_validations) AS total_validations,
    sum(daily_stats_complete.total_contribution_duration) AS total_contribution_duration,
    sum(daily_stats_complete.total_validation_duration) AS total_validation_duration,
    daily_stats_complete.type
   FROM daily_stats_complete_newest daily_stats_complete
  GROUP BY daily_stats_complete.type, daily_stats_complete.language, daily_stats_complete.year, (date_part('quarter'::text, concat(daily_stats_complete.year, '-', daily_stats_complete.month, '-', daily_stats_complete.day)::date));

CREATE OR REPLACE VIEW public.quarterly_cumulative_stats_all
 AS
 WITH quarterly_stats_all AS (
         SELECT quarterly_stats_complete.year,
            quarterly_stats_complete.quarter,
            sum(quarterly_stats_complete.total_contributions) AS total_contributions,
            sum(quarterly_stats_complete.total_validations) AS total_validations,
            sum(quarterly_stats_complete.total_contribution_duration) AS total_contribution_duration,
            sum(quarterly_stats_complete.total_validation_duration) AS total_validation_duration,
            quarterly_stats_complete.type
           FROM quarterly_stats_complete
          GROUP BY quarterly_stats_complete.type, quarterly_stats_complete.year, quarterly_stats_complete.quarter
          ORDER BY quarterly_stats_complete.year, quarterly_stats_complete.quarter
        )
 SELECT quarterly_stats_all.year,
    quarterly_stats_all.quarter,
    sum(quarterly_stats_all.total_contributions) OVER (PARTITION BY quarterly_stats_all.type ORDER BY quarterly_stats_all.year, quarterly_stats_all.quarter ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_contributions,
    sum(quarterly_stats_all.total_validations) OVER (PARTITION BY quarterly_stats_all.type ORDER BY quarterly_stats_all.year, quarterly_stats_all.quarter ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_validations,
    sum(quarterly_stats_all.total_contribution_duration) OVER (PARTITION BY quarterly_stats_all.type ORDER BY quarterly_stats_all.year, quarterly_stats_all.quarter ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_contribution_duration,
    sum(quarterly_stats_all.total_validation_duration) OVER (PARTITION BY quarterly_stats_all.type ORDER BY quarterly_stats_all.year, quarterly_stats_all.quarter ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_validation_duration,
    quarterly_stats_all.type
   FROM quarterly_stats_all;

 CREATE OR REPLACE VIEW public.quarterly_cumulative_stats_per_language
 AS
 SELECT quarterly_stats_complete.language,
    quarterly_stats_complete.year,
    quarterly_stats_complete.quarter,
    sum(quarterly_stats_complete.total_contributions) OVER (PARTITION BY quarterly_stats_complete.language, quarterly_stats_complete.type ORDER BY quarterly_stats_complete.year, quarterly_stats_complete.quarter ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_contributions,
    sum(quarterly_stats_complete.total_validations) OVER (PARTITION BY quarterly_stats_complete.language, quarterly_stats_complete.type ORDER BY quarterly_stats_complete.year, quarterly_stats_complete.quarter ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_validations,
    sum(quarterly_stats_complete.total_contribution_duration) OVER (PARTITION BY quarterly_stats_complete.language, quarterly_stats_complete.type ORDER BY quarterly_stats_complete.year, quarterly_stats_complete.quarter ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_contribution_duration,
    sum(quarterly_stats_complete.total_validation_duration) OVER (PARTITION BY quarterly_stats_complete.language, quarterly_stats_complete.type ORDER BY quarterly_stats_complete.year, quarterly_stats_complete.quarter ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_validation_duration,
    quarterly_stats_complete.type
   FROM quarterly_stats_complete;
  
 CREATE OR REPLACE VIEW public.weekly_stats_complete
    AS
    SELECT daily_stats_complete.language,
    daily_stats_complete.year,
    date_part('week'::text, make_date(daily_stats_complete.year::integer, daily_stats_complete.month::integer, daily_stats_complete.day::integer)) AS week,
    sum(daily_stats_complete.total_contributions) AS total_contributions,
    sum(daily_stats_complete.total_validations) AS total_validations,
    sum(daily_stats_complete.total_contribution_duration) AS total_contribution_duration,
    sum(daily_stats_complete.total_validation_duration) AS total_validation_duration,
    daily_stats_complete.type
   FROM daily_stats_complete_newest daily_stats_complete
  GROUP BY daily_stats_complete.type, daily_stats_complete.language, daily_stats_complete.year, (date_part('week'::text, make_date(daily_stats_complete.year::integer, daily_stats_complete.month::integer, daily_stats_complete.day::integer)));

 CREATE OR REPLACE VIEW public.weekly_cumulative_stats_all
 AS
 WITH weekly_stats_all AS (
         SELECT weekly_stats_complete.year,
            weekly_stats_complete.week,
            sum(weekly_stats_complete.total_contributions) AS total_contributions,
            sum(weekly_stats_complete.total_validations) AS total_validations,
            sum(weekly_stats_complete.total_contribution_duration) AS total_contribution_duration,
            sum(weekly_stats_complete.total_validation_duration) AS total_validation_duration,
            weekly_stats_complete.type
           FROM weekly_stats_complete
          GROUP BY weekly_stats_complete.type, weekly_stats_complete.year, weekly_stats_complete.week
          ORDER BY weekly_stats_complete.year, weekly_stats_complete.week
        )
 SELECT weekly_stats_all.year,
    weekly_stats_all.week,
    sum(weekly_stats_all.total_contributions) OVER (PARTITION BY weekly_stats_all.type ORDER BY weekly_stats_all.year, weekly_stats_all.week ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_contributions,
    sum(weekly_stats_all.total_validations) OVER (PARTITION BY weekly_stats_all.type ORDER BY weekly_stats_all.year, weekly_stats_all.week ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_validations,
    sum(weekly_stats_all.total_contribution_duration) OVER (PARTITION BY weekly_stats_all.type ORDER BY weekly_stats_all.year, weekly_stats_all.week ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_contribution_duration,
    sum(weekly_stats_all.total_validation_duration) OVER (PARTITION BY weekly_stats_all.type ORDER BY weekly_stats_all.year, weekly_stats_all.week ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_validation_duration,
    weekly_stats_all.type
   FROM weekly_stats_all;
 
 CREATE OR REPLACE VIEW public.weekly_cumulative_stats_per_language
 AS
 SELECT weekly_stats_complete.language,
    weekly_stats_complete.year,
    weekly_stats_complete.week,
    sum(weekly_stats_complete.total_contributions) OVER (PARTITION BY weekly_stats_complete.language, weekly_stats_complete.type ORDER BY weekly_stats_complete.year, weekly_stats_complete.week ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_contributions,
    sum(weekly_stats_complete.total_validations) OVER (PARTITION BY weekly_stats_complete.language, weekly_stats_complete.type ORDER BY weekly_stats_complete.year, weekly_stats_complete.week ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_validations,
    sum(weekly_stats_complete.total_contribution_duration) OVER (PARTITION BY weekly_stats_complete.language, weekly_stats_complete.type ORDER BY weekly_stats_complete.year, weekly_stats_complete.week ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_contribution_duration,
    sum(weekly_stats_complete.total_validation_duration) OVER (PARTITION BY weekly_stats_complete.language, weekly_stats_complete.type ORDER BY weekly_stats_complete.year, weekly_stats_complete.week ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_validation_duration,
    weekly_stats_complete.type
   FROM weekly_stats_complete;
   
DROP MATERIALIZED VIEW public.daily_stats_complete; 
  
DROP MATERIALIZED VIEW public.contributions_and_demo_stats;

ALTER MATERIALIZED VIEW public.daily_stats_complete_newest
  RENAME TO daily_stats_complete;
  
ALTER MATERIALIZED VIEW public.contributions_and_demo_stats_newest
  RENAME TO contributions_and_demo_stats;
