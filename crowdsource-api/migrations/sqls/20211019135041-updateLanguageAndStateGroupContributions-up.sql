/* Replace with your SQL commands */
DROP MATERIALIZED VIEW public.language_and_state_group_contributions;
CREATE MATERIALIZED VIEW public.language_and_state_group_contributions
 AS
 SELECT COALESCE(cs.state, vs.state) AS state,
    COALESCE(cs.language, vs.language) AS language,
    count(DISTINCT COALESCE(cs.contribute_id, vs.validate_id)) AS total_speakers,
    round(sum(COALESCE(cs.total_contributions,0))::numeric / 3600::numeric, 3) AS total_contributions,
    round(sum(COALESCE(vs.total_validations,0))::numeric / 3600::numeric, 3) AS total_validations,
    sum(COALESCE(cs.total_contribution_count,0)) AS total_contribution_count,
    sum(COALESCE(vs.total_validation_count,0)) AS total_validation_count,
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

 ALTER TABLE public.language_and_state_group_contributions
    OWNER TO postgres;
