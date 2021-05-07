\a
\t
\o ageGroupContributions.json 
SELECT array_to_json(array_agg(row_to_json (t))) FROM ( SELECT  age_group, count(*) as contributions, ROUND(sum(contribution_audio_duration)::decimal/3600, 3) as hours_contributed,ROUND(sum(validation_audio_duration)::decimal/3600, 3) as hours_validated, count(distinct(contributed_by)) as speakers, type from contributions_and_demo_stats  group by age_group ORDER BY contributions DESC)t;

\o genderGroupContributions.json 
SELECT array_to_json(array_agg(row_to_json (t))) FROM ( SELECT  gender,count(*) as contributions, ROUND(sum(contribution_audio_duration)::decimal/3600, 3) as hours_contributed,ROUND(sum(validation_audio_duration)::decimal/3600, 3) as hours_validated, count(distinct(contributed_by)) as speakers, type from contributions_and_demo_stats  group by gender ORDER BY contributions DESC)t;

\o dailyTimeline.json
SELECT array_to_json(array_agg(row_to_json (t))) FROM ( select day, month, year, language, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations, cumulative_contributions total_contribution_count, cumulative_validations total_validation_count, type from daily_cumulative_stats_per_language)t;

\o dailyTimelineCumulative.json 
SELECT array_to_json(array_agg(row_to_json (t))) FROM ( select day, month, year, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations, cumulative_contributions total_contribution_count, cumulative_validations total_validation_count, type from daily_cumulative_stats_all)t;

\o weeklyTimeline.json 
SELECT array_to_json(array_agg(row_to_json (t))) FROM ( SELECT  year, week,language, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations, cumulative_contributions total_contribution_count, cumulative_validations total_validation_count, type from weekly_cumulative_stats_per_language )t;

\o weeklyTimelineCumulative.json 
SELECT array_to_json(array_agg(row_to_json (t))) FROM ( SELECT  year, week, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations, cumulative_contributions total_contribution_count, cumulative_validations total_validation_count, type FROM weekly_cumulative_stats_all)t;

\o monthlyTimeline.json 
SELECT array_to_json(array_agg(row_to_json (t))) FROM ( SELECT  year, month, language, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations, cumulative_contributions total_contribution_count, cumulative_validations total_validation_count, type from monthly_cumulative_stats_per_language )t;

\o monthlyTimelineCumulative.json 
SELECT array_to_json(array_agg(row_to_json (t))) FROM ( SELECT  year, month, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations, cumulative_contributions total_contribution_count, cumulative_validations total_validation_count, type FROM monthly_cumulative_stats_all)t;

\o quarterlyTimeline.json 
SELECT array_to_json(array_agg(row_to_json (t))) FROM ( SELECT  year, quarter, language, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations, cumulative_contributions total_contribution_count, cumulative_validations total_validation_count, type from quarterly_cumulative_stats_per_language )t;

\o quarterlyTimelineCumulative.json 
SELECT array_to_json(array_agg(row_to_json (t))) FROM ( SELECT  year, quarter, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations, cumulative_contributions total_contribution_count, cumulative_validations total_validation_count, type FROM quarterly_cumulative_stats_all)t;

\o cumulativeCount.json 
SELECT array_to_json(array_agg(row_to_json (t))) FROM ( SELECT  count(distinct(language)) as total_languages,
count(distinct(contributed_by)) as total_speakers,ROUND((sum(contribution_audio_duration) FILTER (WHERE audio_row_num_per_contribution_id = 1 ))::numeric/3600,3)  as total_contributions,ROUND(sum(contributions_and_demo_stats.validation_audio_duration)::numeric/3600, 3)  as total_validations, count(distinct contribution_id) total_contribution_count, sum(contributions_and_demo_stats.is_validated) total_validation_count, contributions_and_demo_stats.type from contributions_and_demo_stats group by contributions_and_demo_stats.type)t;

\o cumulativeDataByState.json 
SELECT array_to_json(array_agg(row_to_json (t))) FROM ( select state, total_speakers, total_contributions, total_validations, total_contribution_count, total_validation_count, type from state_group_contributions)t;


\o cumulativeDataByLanguage.json 
SELECT array_to_json(array_agg(row_to_json (t))) FROM ( select language, total_speakers,ROUND(total_contributions::numeric/3600,3) as total_contributions,ROUND(total_validations::numeric/3600, 3) as total_validations, total_contribution_count, total_validation_count, type from language_group_contributions)t;

\o cumulativeDataByLanguageAndState.json 
SELECT array_to_json(array_agg(row_to_json (t))) FROM ( select state, language, total_speakers, ROUND(total_contributions::numeric/3600,3) as total_contributions, ROUND(total_validations::numeric/3600,3) as total_validations, total_contribution_count, total_validation_count, type from language_and_state_group_contributions)t;

\o listLanguages.json 
SELECT array_to_json(array_agg(row_to_json (t))) FROM ( SELECT  distinct(language), type from contributions_and_demo_stats)t;

\o topLanguagesBySpeakerContributions.json 
SELECT array_to_json(array_agg(row_to_json (t))) FROM ( select language, total_speakers, type from language_group_contributions ORDER BY total_speakers DESC LIMIT 5)t;

\o topLanguagesByHoursContributed.json 
SELECT array_to_json(array_agg(row_to_json (t))) FROM ( select language,ROUND(total_contributions::numeric/3600, 3) as total_contributions, type from language_group_contributions ORDER BY total_contributions DESC LIMIT 5)t;

\o lastUpdatedAtQuery.json 
SELECT array_to_json(array_agg(row_to_json (t))) FROM ( SELECT  max(lastupdated) AT TIME ZONE 'Asia/Kolkata' from audit_load_log)t;
