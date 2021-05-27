const ageGroupContributionsNew = "select age_group, contributions,ROUND(hours_contributed::decimal/3600, 3) as hours_contributed,ROUND(hours_validated::decimal/3600, 3) as hours_validated, speakers  from age_group_contributions where $1:raw;";
const ageGroupContributions = "select age_group, count(*) as contributions, ROUND(sum(contribution_audio_duration)::decimal/3600, 3) as hours_contributed,ROUND(sum(validation_audio_duration)::decimal/3600, 3) as hours_validated, count(distinct(contributed_by)) as speakers from contributions_and_demo_stats where $1:raw group by age_group ORDER BY contributions DESC;";

const genderGroupContributionsNew = "select gender, contributions, ROUND(hours_contributed::decimal/3600, 3) as hours_contributed,ROUND(hours_validated::decimal/3600, 3) as hours_validated, speakers from gender_group_contributions where $1:raw;";
const genderGroupContributions = "select gender,count(*) as contributions, ROUND(sum(contribution_audio_duration)::decimal/3600, 3) as hours_contributed,ROUND(sum(validation_audio_duration)::decimal/3600, 3) as hours_validated, count(distinct(contributed_by)) as speakers from contributions_and_demo_stats where $1:raw group by gender ORDER BY contributions DESC;";

const dailyTimeline = "select day, month, year, language, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations, cumulative_contributions total_contribution_count, cumulative_validations total_validation_count from daily_cumulative_stats_per_language where $1:raw;";

const dailyTimelineCumulative = "select day, month, year, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations, cumulative_contributions total_contribution_count, cumulative_validations total_validation_count  from daily_cumulative_stats_all where $1:raw;";

const weeklyTimeline = "select year, week,language, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations, cumulative_contributions total_contribution_count, cumulative_validations total_validation_count  from weekly_cumulative_stats_per_language where $1:raw;";

const weeklyTimelineCumulative = "SELECT year, week, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations, cumulative_contributions total_contribution_count, cumulative_validations total_validation_count  FROM weekly_cumulative_stats_all where $1:raw;";

const monthlyTimeline = "select year, month, language, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations, cumulative_contributions total_contribution_count, cumulative_validations total_validation_count  from monthly_cumulative_stats_per_language where $1:raw;";

const monthlyTimelineCumulative = "SELECT year, month, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations, cumulative_contributions total_contribution_count, cumulative_validations total_validation_count  FROM monthly_cumulative_stats_all where $1:raw;";

const quarterlyTimeline = "select year, quarter, language, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations, cumulative_contributions total_contribution_count, cumulative_validations total_validation_count  from quarterly_cumulative_stats_per_language where $1:raw;";

const quarterlyTimelineCumulative = "SELECT year, quarter, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations, cumulative_contributions total_contribution_count, cumulative_validations total_validation_count  FROM quarterly_cumulative_stats_all where $1:raw;";

const cumulativeCount = `select count(distinct(language)) as total_languages, 
count(distinct(contributed_by)) as total_speakers, 
ROUND((sum(contribution_audio_duration) FILTER (WHERE audio_row_num_per_contribution_id = 1 ))::numeric/3600,3)  as total_contributions, 
ROUND(sum(contributions_and_demo_stats.validation_audio_duration)::numeric/3600, 3)  as total_validations,
count(distinct contribution_id) total_contribution_count,
sum(contributions_and_demo_stats.is_validated) total_validation_count
from contributions_and_demo_stats where $1:raw
group by contributions_and_demo_stats.type;`;

const cumulativeDataByState = "select state, total_speakers, total_contributions, total_validations, total_contribution_count, total_validation_count from state_group_contributions where $1:raw;";

const cumulativeDataByLanguage = "select language, total_speakers,ROUND(total_contributions::numeric/3600,3) as total_contributions,ROUND(total_validations::numeric/3600, 3) as total_validations, total_contribution_count, total_validation_count from language_group_contributions where $1:raw;";

const cumulativeDataByLanguageAndState = "select state, language, total_speakers, ROUND(total_contributions::numeric/3600,3) as total_contributions, total_validations, total_contribution_count, total_validation_count from language_and_state_group_contributions where $1:raw;";

const listLanguages = "select distinct(language) from contributions_and_demo_stats where $1:raw;";

const topLanguagesBySpeakerContributions = "select language, total_speakers from language_group_contributions where $1:raw ORDER BY total_speakers DESC;";

const topLanguagesByHoursContributed = "select language,(ROUND(total_contributions::numeric/3600, 3)+ROUND(total_validations::numeric/3600, 3)) as total_contributions,total_contribution_count from language_group_contributions where $1:raw ORDER BY total_contributions DESC;";

const topLanguagesByContributionCount = "select language,(ROUND(total_contributions::numeric/3600, 3)+ROUND(total_validations::numeric/3600, 3)) as total_contributions,(total_contribution_count+total_validation_count) as total_contribution_count from language_group_contributions where $1:raw ORDER BY total_contribution_count DESC;";

const lastUpdatedAtQuery = "select max(lastupdated) AT TIME ZONE 'Asia/Kolkata' from audit_load_log;";

module.exports = {
    listLanguages,
    topLanguagesBySpeakerContributions,
    topLanguagesByHoursContributed,
    dailyTimeline,
    ageGroupContributions,
    genderGroupContributions,
    cumulativeCount,
    cumulativeDataByLanguage,
    cumulativeDataByState,
    cumulativeDataByLanguageAndState,
    dailyTimelineCumulative,
    weeklyTimeline,
    weeklyTimelineCumulative,
    monthlyTimeline,
    monthlyTimelineCumulative,
    quarterlyTimeline,
    quarterlyTimelineCumulative,
    lastUpdatedAtQuery,
    topLanguagesByContributionCount
};