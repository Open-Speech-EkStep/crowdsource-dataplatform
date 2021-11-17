\a
\t
\o ageGroupContributions.json 
SELECT coalesce(array_to_json(array_agg(row_to_json (t))),'[]') FROM ( SELECT age_group, contributions, hours_contributed, hours_validated, speakers from age_group_contributions)t;

\o ageGroupAndLanguageContributions.json 
SELECT coalesce(array_to_json(array_agg(row_to_json (t))),'[]') FROM ( SELECT age_group, contributions, hours_contributed, hours_validated, speakers, language from age_group_and_language_contributions)t;

\o genderGroupContributions.json 
SELECT coalesce(array_to_json(array_agg(row_to_json (t))),'[]') FROM ( SELECT  gender, contributions, ROUND(hours_contributed, 3), ROUND(hours_validated, 3), speakers from gender_group_contributions)t;

\o genderGroupAndLanguageContributions.json 
SELECT coalesce(array_to_json(array_agg(row_to_json (t))),'[]') FROM ( SELECT  gender, contributions, ROUND(hours_contributed, 3), ROUND(hours_validated, 3), speakers, language from gender_and_language_group_contributions)t;

\o dailyTimeline.json
SELECT coalesce(array_to_json(array_agg(row_to_json (t))),'[]') FROM ( select day, month, year, language, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations, cumulative_contributions total_contribution_count, cumulative_validations total_validation_count, type from daily_cumulative_stats_per_language)t;

\o dailyTimelineCumulative.json 
SELECT coalesce(array_to_json(array_agg(row_to_json (t))),'[]') FROM ( select day, month, year, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations, cumulative_contributions total_contribution_count, cumulative_validations total_validation_count, type from daily_cumulative_stats_all)t;

\o weeklyTimeline.json 
SELECT coalesce(array_to_json(array_agg(row_to_json (t))),'[]') FROM ( SELECT  year, week,language, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations, cumulative_contributions total_contribution_count, cumulative_validations total_validation_count, type from weekly_cumulative_stats_per_language )t;

\o weeklyTimelineCumulative.json 
SELECT coalesce(array_to_json(array_agg(row_to_json (t))),'[]') FROM ( SELECT  year, week, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations, cumulative_contributions total_contribution_count, cumulative_validations total_validation_count, type FROM weekly_cumulative_stats_all)t;

\o monthlyTimeline.json 
SELECT coalesce(array_to_json(array_agg(row_to_json (t))),'[]') FROM ( SELECT  year, month, language, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations, cumulative_contributions total_contribution_count, cumulative_validations total_validation_count, type from monthly_cumulative_stats_per_language )t;

\o monthlyTimelineCumulative.json 
SELECT coalesce(array_to_json(array_agg(row_to_json (t))),'[]') FROM ( SELECT  year, month, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations, cumulative_contributions total_contribution_count, cumulative_validations total_validation_count, type FROM monthly_cumulative_stats_all)t;

\o quarterlyTimeline.json 
SELECT coalesce(array_to_json(array_agg(row_to_json (t))),'[]') FROM ( SELECT  year, quarter, language, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations, cumulative_contributions total_contribution_count, cumulative_validations total_validation_count, type from quarterly_cumulative_stats_per_language )t;

\o quarterlyTimelineCumulative.json 
SELECT coalesce(array_to_json(array_agg(row_to_json (t))),'[]') FROM ( SELECT  year, quarter, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations, cumulative_contributions total_contribution_count, cumulative_validations total_validation_count, type FROM quarterly_cumulative_stats_all)t;

\o cumulativeCount.json 
SELECT coalesce(array_to_json(array_agg(row_to_json (t))),'[]') FROM ( SELECT  count(distinct(language)) as total_languages,
ROUND((sum(contribution_audio_duration) FILTER (WHERE audio_row_num_per_contribution_id = 1 and is_system = false))::numeric/3600,3)  as total_contributions,ROUND(sum(contributions_and_demo_stats.validation_audio_duration)::numeric/3600, 3)  as total_validations, count(distinct contribution_id) FILTER (WHERE contributions_and_demo_stats.is_system = false) total_contribution_count, sum(contributions_and_demo_stats.is_validated) total_validation_count, contributions_and_demo_stats.type from contributions_and_demo_stats group by contributions_and_demo_stats.type)t;

\o cumulativeDataByState.json 
SELECT coalesce(array_to_json(array_agg(row_to_json (t))),'[]') FROM ( select state, total_speakers, total_contributions, total_validations, total_contribution_count, total_validation_count, type from state_group_contributions)t;

\o cumulativeDataByLanguage.json 
SELECT coalesce(array_to_json(array_agg(row_to_json (t))),'[]') FROM ( select language, total_speakers, total_contributions, total_validations, total_contribution_count, total_validation_count, type from language_group_contributions)t;

\o cumulativeDataByLanguageAndState.json 
SELECT coalesce(array_to_json(array_agg(row_to_json (t))),'[]') FROM ( select state, language, total_speakers, total_contributions, total_validations, total_contribution_count, total_validation_count, type from language_and_state_group_contributions)t;

\o listLanguages.json 
SELECT coalesce(array_to_json(array_agg(row_to_json (t))),'[]') FROM ( SELECT  distinct(language), type from contributions_and_demo_stats)t;

\o topLanguagesBySpeakerContributions.json 
SELECT coalesce(array_to_json(array_agg(row_to_json (t))),'[]') FROM ( select language, total_speakers, type from (select language, total_speakers, type, row_number() OVER ( PARTITION BY type ORDER BY total_speakers DESC ) rank from language_group_contributions) as language_data where  rank < 6)t;

\o topLanguagesByHoursContributed.json 
SELECT coalesce(array_to_json(array_agg(row_to_json (t))),'[]') FROM ( select language, coalesce(total_contributions, 0) total_contributions, total_contribution_count, type from (select language,(total_contributions + total_validations) as total_contributions, (total_contribution_count + total_validation_count) as total_contribution_count, row_number() OVER ( PARTITION BY type ORDER BY (total_contributions + total_validations) DESC,
					   (total_contribution_count + total_validation_count) DESC ) rank, type from language_group_contributions ) as language_data where  rank < 6)t;

\o lastUpdatedAtQuery.json 
SELECT coalesce(array_to_json(array_agg(row_to_json (t))),'[]') FROM ( SELECT  max(lastupdated) AT TIME ZONE 'Asia/Kolkata' from audit_load_log)t;

\o participationStats.json
SELECT coalesce(array_to_json(array_agg(row_to_json (t))),'[]') FROM ( select count(distinct(users)) as count, type from 
(SELECT contributed_by AS users, type FROM contributions_and_demo_stats
 UNION SELECT validated_by as users, type FROM contributions_and_demo_stats) as cds 
 where users!=(select contributor_id from contributors where user_name='##system##') group by type)t;

\o initiativeGoals.json
SELECT coalesce(array_to_json(array_agg(row_to_json (t))),'[]') FROM ( select sum(goal) FILTER (WHERE category = 'contribute') as contribution_goal, sum(goal) FILTER (WHERE category = 'validate') as validation_goal, type from language_goals group by type )t;

\o initiativeGoalsByLanguage.json
SELECT coalesce(array_to_json(array_agg(row_to_json (t))),'[]') FROM ( select sum(goal) FILTER (WHERE category = 'contribute') as contribution_goal, sum(goal) FILTER (WHERE category = 'validate') as validation_goal, type, language from language_goals group by type, language )t;

\o languagesWithData.json
SELECT coalesce(array_to_json(array_agg(row_to_json (t))),'[]') FROM ( select type, media->>'language' as language from dataset_row dr inner join configurations conf2 on conf2.config_name='include_profane' 
inner join configurations conf3 on conf3.config_name='show_demo_data'
left join master_dataset mds on dr.master_dataset_id=mds.master_dataset_id
where (conf2.value=1 or is_profane=false) 
and (conf3.value=0 or for_demo=true)
and coalesce(mds.is_active, true) = true group by type, language )t;

\o enableDisableCards.json
SELECT coalesce(array_to_json(array_agg(row_to_json (t))),'[]') FROM ( select coalesce(has_target.type,all_contributed.type) as type, coalesce(has_target.language,all_contributed.language) as language, coalesce(has_target.hasTarget,false) as hasTarget, coalesce(all_contributed.isAllContributed,false) as isAllContributed 
from
(select type,
CASE
	WHEN type = 'parallel'::text THEN ((dr.media->>'language') || '-' || (con.media->>'language'))
	ELSE dr.media->>'language'
END AS language, true as hasTarget from contributions con inner join dataset_row dr on con.dataset_row_id=dr.dataset_row_id left join validations val on 
  con.contribution_id=val.contribution_id and val.action!='skip' inner join configurations conf on conf.config_name='validation_count'
  inner join configurations conf2 on conf2.config_name='include_profane' 
  inner join configurations conf3 on conf3.config_name='show_demo_data'
  left join master_dataset mds on dr.master_dataset_id=mds.master_dataset_id
where con.action='completed'
and (conf2.value=1 or is_profane=false) 
and (conf3.value=0 or for_demo=true)
and coalesce(mds.is_active, true) = true
group by val.contribution_id, conf.value, type, language having count(val.*)<conf.value) as has_target
full outer join (
with typelanggrp as (select type, dr.media->>'language' as fromLanguage, con.media->>'language' as toLanguage from dataset_row dr 
left join contributions con on con.dataset_row_id=dr.dataset_row_id
inner join configurations conf2 on conf2.config_name='include_profane' and (conf2.value=1 or is_profane=false)
inner join configurations conf3 on conf3.config_name='show_demo_data'  and (conf3.value=0 or for_demo=true)
left join master_dataset mds on dr.master_dataset_id=mds.master_dataset_id and coalesce(mds.is_active, true) = true
group by type,fromLanguage,toLanguage)
select type, 
	CASE
	WHEN type = 'parallel'::text THEN ((l.fromLanguage) || '-' || (l.toLanguage))
	ELSE l.fromLanguage END AS language, true as isAllContributed from typelanggrp l
	where not exists ( select 1 from dataset_row
	where dataset_row.type=l.type and dataset_row.media->>'language'=l.fromLanguage
		and not exists (
		select 1 from contributions where contributions.dataset_row_id=dataset_row.dataset_row_id 
			and (dataset_row.type!='parallel' or contributions.media->>'language'=l.toLanguage) and contributions.action='completed'))
group by type,language) as all_contributed on has_target.type=all_contributed.type and has_target.language=all_contributed.language
group by has_target.type,all_contributed.type, has_target.language,all_contributed.language, has_target.hasTarget, all_contributed.isAllContributed )t
