/* Replace with your SQL commands */

CREATE MATERIALIZED VIEW age_group_contributions AS (
 select age_group,
	count(*) as contributions,
	sum(contribution_audio_duration) as hours_contributed,
	sum(validation_audio_duration) as hours_validated, 
	count(distinct(contributed_by)) as speakers from contributions_and_demo_stats 
	group by age_group
	ORDER BY contributions DESC); 
	
REFRESH MATERIALIZED VIEW age_group_contributions;


CREATE MATERIALIZED VIEW gender_group_contributions AS (
select gender,count(*) as contributions, sum(contribution_audio_duration) as hours_contributed,
	sum(validation_audio_duration) as hours_validated, count(distinct(contributed_by)) as speakers from
	contributions_and_demo_stats group by gender ORDER BY contributions DESC);
	
REFRESH MATERIALIZED VIEW gender_group_contributions;

CREATE MATERIALIZED VIEW language_group_contributions AS (
select language,
count(distinct(contributed_by)) as total_speakers ,
sum(contribution_audio_duration) FILTER (WHERE audio_row_num_per_contribution_id = 1 )  as total_contributions,
sum(contributions_and_demo_stats.validation_audio_duration)  as total_validations
from contributions_and_demo_stats
group by language);

REFRESH MATERIALIZED VIEW language_group_contributions;


CREATE MATERIALIZED VIEW state_group_contributions AS (
select coalesce(contribution_by_state.state, validation_by_state.state) as state, total_speakers, total_contributions, total_validations
from
(select contributions_state_region as state,
count(distinct(contributed_by)) as total_speakers,
ROUND((sum(contribution_audio_duration) FILTER (WHERE audio_row_num_per_contribution_id = 1 ))::numeric/3600,3)  as total_contributions
from contributions_and_demo_stats
group by contributions_state_region) as contribution_by_state FULL OUTER JOIN
(select validations_state_region as state,
ROUND(sum(contributions_and_demo_stats.validation_audio_duration)::numeric/3600, 3)  as total_validations
from contributions_and_demo_stats
group by validations_state_region) as validation_by_state on contribution_by_state.state = validation_by_state.state
);
REFRESH MATERIALIZED VIEW state_group_contributions;


CREATE MATERIALIZED VIEW language_and_state_group_contributions AS (
select 
coalesce(cs.state, vs.state) as state, 
coalesce(cs.language, vs.language) as language, total_speakers, total_contributions, total_validations
from
(select contributions_state_region as state, language,
count(distinct(contributed_by)) as total_speakers,
sum(contribution_audio_duration) FILTER (WHERE audio_row_num_per_contribution_id = 1 ) as total_contributions
from contributions_and_demo_stats
group by contributions_state_region,language) as cs
FULL OUTER JOIN
(select validations_state_region as state, language,
ROUND(sum(contributions_and_demo_stats.validation_audio_duration)::numeric/3600, 3)  as total_validations
from contributions_and_demo_stats
group by validations_state_region, language) as vs
on cs.state = vs.state and cs.language = vs.language);

REFRESH MATERIALIZED VIEW language_and_state_group_contributions;

