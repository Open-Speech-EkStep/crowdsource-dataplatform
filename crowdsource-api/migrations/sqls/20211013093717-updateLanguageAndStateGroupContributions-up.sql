-- View: public.language_group_contributions

DROP MATERIALIZED VIEW public.language_group_contributions;

CREATE MATERIALIZED VIEW public.language_group_contributions
TABLESPACE pg_default
AS
 SELECT COALESCE(contribution_by_language.language, validation_by_language.language) AS language,
    count(DISTINCT COALESCE(validation_by_language.validate_id, contribution_by_language.contribute_id)) AS total_speakers,
    round(sum(COALESCE(contribution_by_language.total_contributions, 0::bigint))::numeric / 3600::numeric, 3) AS total_contributions,
    round(sum(COALESCE(validation_by_language.total_validations, 0::bigint))::numeric / 3600::numeric, 3) AS total_validations,
    COALESCE(contribution_by_language.type, validation_by_language.type) AS type,
    sum(COALESCE(contribution_by_language.total_contribution_count, 0::bigint)) AS total_contribution_count,
    sum(COALESCE(validation_by_language.total_validation_count, 0::bigint)) AS total_validation_count
   FROM ( SELECT contributions_and_demo_stats.language,
            contributions_and_demo_stats.contributed_by AS contribute_id,
            sum(contributions_and_demo_stats.contribution_audio_duration) FILTER (WHERE contributions_and_demo_stats.audio_row_num_per_contribution_id = 1) AS total_contributions,
            contributions_and_demo_stats.type,
            count(DISTINCT contributions_and_demo_stats.contribution_id) AS total_contribution_count
           FROM contributions_and_demo_stats contributions_and_demo_stats
          WHERE contributions_and_demo_stats.is_system = false
          GROUP BY contributions_and_demo_stats.type, contributions_and_demo_stats.language, contributions_and_demo_stats.contributed_by) contribution_by_language
     FULL JOIN ( SELECT contributions_and_demo_stats.language,
            contributions_and_demo_stats.validated_by AS validate_id,
            sum(contributions_and_demo_stats.validation_audio_duration) AS total_validations,
            contributions_and_demo_stats.type,
            sum(contributions_and_demo_stats.is_validated) AS total_validation_count
           FROM contributions_and_demo_stats contributions_and_demo_stats
          GROUP BY contributions_and_demo_stats.type, contributions_and_demo_stats.language, contributions_and_demo_stats.validated_by) validation_by_language ON contribution_by_language.language = validation_by_language.language AND contribution_by_language.type = validation_by_language.type AND validation_by_language.validate_id = contribution_by_language.contribute_id
  GROUP BY (COALESCE(contribution_by_language.language, validation_by_language.language)), (COALESCE(contribution_by_language.type, validation_by_language.type))
WITH DATA;

ALTER TABLE public.language_group_contributions
    OWNER TO postgres;

DROP MATERIALIZED VIEW public.state_group_contributions;
CREATE MATERIALIZED VIEW public.state_group_contributions
 AS
 SELECT COALESCE(contribution_by_state.state, validation_by_state.state) AS state,
    count(DISTINCT COALESCE(validation_by_state.validate_id, contribution_by_state.contribute_id)) AS total_speakers,
    round(sum(COALESCE(contribution_by_state.total_contributions,0))::numeric / 3600::numeric, 3) AS total_contributions,
    round(sum(COALESCE(validation_by_state.total_validations,0))::numeric / 3600::numeric, 3) AS total_validations,
    COALESCE(contribution_by_state.type, validation_by_state.type) AS type,
    sum(COALESCE(contribution_by_state.total_contribution_count,0)) AS total_contribution_count,
    sum(COALESCE(validation_by_state.total_validation_count,0)) AS total_validation_count
   FROM ( SELECT contributions_and_demo_stats.contributions_state_region AS state,
            contributions_and_demo_stats.contributed_by AS contribute_id,
            sum(contributions_and_demo_stats.contribution_audio_duration) FILTER (WHERE contributions_and_demo_stats.audio_row_num_per_contribution_id = 1) AS total_contributions,
            contributions_and_demo_stats.type,
            count(DISTINCT contributions_and_demo_stats.contribution_id) AS total_contribution_count
           FROM contributions_and_demo_stats contributions_and_demo_stats
          WHERE contributions_and_demo_stats.is_system = false
          GROUP BY contributions_and_demo_stats.type, contributions_and_demo_stats.contributions_state_region, contributions_and_demo_stats.contributed_by) contribution_by_state
     FULL JOIN ( SELECT contributions_and_demo_stats.validations_state_region AS state,
            contributions_and_demo_stats.validated_by AS validate_id,
            sum(contributions_and_demo_stats.validation_audio_duration) AS total_validations,
            contributions_and_demo_stats.type,
            sum(contributions_and_demo_stats.is_validated) AS total_validation_count
           FROM contributions_and_demo_stats contributions_and_demo_stats
          GROUP BY contributions_and_demo_stats.type, contributions_and_demo_stats.validations_state_region, contributions_and_demo_stats.validated_by) validation_by_state ON contribution_by_state.state = validation_by_state.state AND contribution_by_state.type = validation_by_state.type AND validation_by_state.validate_id = contribution_by_state.contribute_id
  GROUP BY (COALESCE(contribution_by_state.state, validation_by_state.state)), (COALESCE(contribution_by_state.type, validation_by_state.type))
 WITH DATA;
 
ALTER TABLE public.state_group_contributions
    OWNER TO postgres;
