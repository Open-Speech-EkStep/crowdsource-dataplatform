/* Replace with your SQL commands */
DROP MATERIALIZED VIEW public.gender_group_contributions;
CREATE MATERIALIZED VIEW public.gender_group_contributions
 AS
  SELECT contributions_and_demo_stats.gender,
    count(*) AS contributions,
    round(sum(contributions_and_demo_stats.contribution_audio_duration)::numeric / 3600::numeric, 3) AS hours_contributed,
    round(sum(contributions_and_demo_stats.validation_audio_duration)::numeric / 3600::numeric, 3) AS hours_validated,
    count(DISTINCT contributions_and_demo_stats.contributed_by) AS speakers
   FROM contributions_and_demo_stats contributions_and_demo_stats
  WHERE contributions_and_demo_stats.type = 'text'::text
  GROUP BY contributions_and_demo_stats.gender
  ORDER BY (count(*)) DESC
 WITH DATA;

DROP MATERIALIZED VIEW public.gender_and_language_group_contributions;
CREATE MATERIALIZED VIEW public.gender_and_language_group_contributions
 AS
 SELECT contributions_and_demo_stats.gender,
    count(*) AS contributions,
    round(sum(contributions_and_demo_stats.contribution_audio_duration)::numeric / 3600::numeric, 3) AS hours_contributed,
    round(sum(contributions_and_demo_stats.validation_audio_duration)::numeric / 3600::numeric, 3) AS hours_validated,
    count(DISTINCT contributions_and_demo_stats.contributed_by) AS speakers,
    contributions_and_demo_stats.language
   FROM contributions_and_demo_stats contributions_and_demo_stats
  WHERE contributions_and_demo_stats.type = 'text'::text
  GROUP BY contributions_and_demo_stats.gender, contributions_and_demo_stats.language
  ORDER BY (count(*)) DESC
 WITH DATA;

 DROP MATERIALIZED VIEW public.state_group_contributions;
CREATE MATERIALIZED VIEW public.state_group_contributions
 AS
 SELECT COALESCE(contribution_by_state.state, validation_by_state.state) AS state,
    count(DISTINCT COALESCE(validation_by_state.validate_id, contribution_by_state.contribute_id)) AS total_speakers,
    round(sum(COALESCE(contribution_by_state.total_contributions, 0::double precision))::numeric / 3600::numeric, 3) AS total_contributions,
    round(sum(COALESCE(validation_by_state.total_validations, 0::double precision))::numeric / 3600::numeric, 3) AS total_validations,
    COALESCE(contribution_by_state.type, validation_by_state.type) AS type,
    sum(COALESCE(contribution_by_state.total_contribution_count, 0::bigint)) AS total_contribution_count,
    sum(COALESCE(validation_by_state.total_validation_count, 0::numeric)) AS total_validation_count
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

DROP MATERIALIZED VIEW public.language_and_state_group_contributions;
CREATE MATERIALIZED VIEW public.language_and_state_group_contributions
 AS
 SELECT COALESCE(cs.state, vs.state) AS state,
    COALESCE(cs.language, vs.language) AS language,
    count(DISTINCT COALESCE(cs.contribute_id, vs.validate_id)) AS total_speakers,
    round(sum(COALESCE(cs.total_contributions, 0::double precision))::numeric / 3600::numeric, 3) AS total_contributions,
    round(sum(COALESCE(vs.total_validations, 0::double precision))::numeric / 3600::numeric, 3) AS total_validations,
    sum(COALESCE(cs.total_contribution_count, 0::bigint)) AS total_contribution_count,
    sum(COALESCE(vs.total_validation_count, 0::numeric)) AS total_validation_count,
    COALESCE(cs.type, vs.type) AS type
   FROM ( SELECT contributions_and_demo_stats.contributions_state_region AS state,
            contributions_and_demo_stats.language,
            contributions_and_demo_stats.contributed_by AS contribute_id,
            sum(contributions_and_demo_stats.contribution_audio_duration) FILTER (WHERE contributions_and_demo_stats.audio_row_num_per_contribution_id = 1) AS total_contributions,
            contributions_and_demo_stats.type,
            count(DISTINCT contributions_and_demo_stats.contribution_id) AS total_contribution_count
           FROM contributions_and_demo_stats contributions_and_demo_stats
          WHERE contributions_and_demo_stats.is_system = false
          GROUP BY contributions_and_demo_stats.type, contributions_and_demo_stats.contributions_state_region, contributions_and_demo_stats.language, contributions_and_demo_stats.contributed_by) cs
     FULL JOIN ( SELECT contributions_and_demo_stats.validations_state_region AS state,
            contributions_and_demo_stats.language,
            contributions_and_demo_stats.validated_by AS validate_id,
            sum(contributions_and_demo_stats.validation_audio_duration) AS total_validations,
            contributions_and_demo_stats.type,
            sum(contributions_and_demo_stats.is_validated) AS total_validation_count
           FROM contributions_and_demo_stats contributions_and_demo_stats
          GROUP BY contributions_and_demo_stats.type, contributions_and_demo_stats.validations_state_region, contributions_and_demo_stats.language, contributions_and_demo_stats.validated_by) vs ON cs.state = vs.state AND cs.language = vs.language AND cs.type = vs.type AND cs.contribute_id = vs.validate_id
  GROUP BY (COALESCE(cs.state, vs.state)), (COALESCE(cs.language, vs.language)), (COALESCE(cs.type, vs.type))
 WITH DATA;