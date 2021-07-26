select * into dashboard_stats from contributions_and_demo_stats;

CREATE OR REPLACE PROCEDURE update_view_data()
LANGUAGE 'sql'
AS $BODY$
do $$
declare
max_date date := (
select max(date) as date from dashboard_stats
);
begin
insert into dashboard_stats (contributed_by, contribution_id, validated_by, validation_id, date, gender, age_group, mother_tongue, contributions_state_region, validations_state_region, contribution_audio_duration, audio_row_num_per_contribution_id, language, "sentenceId", is_validated, validation_audio_duration, type, is_system)
 SELECT contributions.contributed_by,
    contributions.contribution_id,
    validations.validated_by,
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
    row_number() OVER (PARTITION BY contributions.contribution_id ORDER BY (contributions.media ->> 'duration'::text) DESC) AS audio_row_num_per_contribution_id,
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
            WHEN validations.action = ANY (ARRAY['accept'::text, 'reject'::text]) THEN
            CASE
                WHEN dataset_row.type = 'text'::text THEN COALESCE((contributions.media ->> 'duration'::text)::double precision, 0::double precision)
                ELSE COALESCE((dataset_row.media ->> 'duration'::text)::double precision, 0::double precision)
            END
            ELSE 0::bigint::double precision
        END AS validation_audio_duration,
    dataset_row.type,
    contributions.is_system
   FROM contributions
     LEFT JOIN validations ON contributions.contribution_id = validations.contribution_id
     JOIN dataset_row ON dataset_row.dataset_row_id = contributions.dataset_row_id
     LEFT JOIN contributors ON contributors.contributor_id = contributions.contributed_by
     JOIN configurations conf ON conf.config_name = 'include_profane'::text
  WHERE contributions.action = 'completed'::text AND contributions.date >= max_date AND (conf.value = 1 OR dataset_row.is_profane = false)
  ORDER BY contributions.contributed_by;

  REFRESH MATERIALIZED VIEW contributions_and_demo_stats;REFRESH MATERIALIZED VIEW daily_stats_complete;REFRESH MATERIALIZED VIEW gender_group_contributions;REFRESH MATERIALIZED VIEW age_group_contributions;REFRESH MATERIALIZED VIEW language_group_contributions;REFRESH MATERIALIZED VIEW state_group_contributions;REFRESH MATERIALIZED VIEW language_and_state_group_contributions;

end $$;
$BODY$;