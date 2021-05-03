const ageGroupContributionsNew = "select age_group, contributions,ROUND(hours_contributed::decimal/3600, 3) as hours_contributed,ROUND(hours_validated::decimal/3600, 3) as hours_validated, speakers  from age_group_contributions where $1:raw;";
const ageGroupContributions = "select age_group, count(*) as contributions, ROUND(sum(contribution_audio_duration)::decimal/3600, 3) as hours_contributed,ROUND(sum(validation_audio_duration)::decimal/3600, 3) as hours_validated, count(distinct(contributed_by)) as speakers from contributions_and_demo_stats_new where $1:raw group by age_group ORDER BY contributions DESC;";

const genderGroupContributionsNew = "select gender, contributions, ROUND(hours_contributed::decimal/3600, 3) as hours_contributed,ROUND(hours_validated::decimal/3600, 3) as hours_validated, speakers from gender_group_contributions where $1:raw;";
const genderGroupContributions = "select gender,count(*) as contributions, ROUND(sum(contribution_audio_duration)::decimal/3600, 3) as hours_contributed,ROUND(sum(validation_audio_duration)::decimal/3600, 3) as hours_validated, count(distinct(contributed_by)) as speakers from contributions_and_demo_stats_new where $1:raw group by gender ORDER BY contributions DESC;";

const dailyTimeline = "select day, month, year, language, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations from daily_cumulative_stats_per_language where $1:raw;";

const dailyTimelineCumulative = "select day, month, year, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations from daily_cumulative_stats_all where $1:raw;";

const weeklyTimeline = "select year, week,language, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations from weekly_cumulative_stats_per_language where $1:raw;";

const weeklyTimelineCumulative = "SELECT year, week, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations FROM weekly_cumulative_stats_all where $1:raw;";

const monthlyTimeline = "select year, month, language, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations from monthly_cumulative_stats_per_language where $1:raw;";

const monthlyTimelineCumulative = "SELECT year, month, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations FROM monthly_cumulative_stats_all where $1:raw;";

const quarterlyTimeline = "select year, quarter, language, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations from quarterly_cumulative_stats_per_language where $1:raw;";

const quarterlyTimelineCumulative = "SELECT year, quarter, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations FROM quarterly_cumulative_stats_all where $1:raw;";

const cumulativeCount = `select count(distinct(language)) as total_languages, 
count(distinct(contributed_by)) as total_speakers, 
ROUND((sum(contribution_audio_duration) FILTER (WHERE audio_row_num_per_contribution_id = 1 ))::numeric/3600,3)  as total_contributions, 
ROUND(sum(contributions_and_demo_stats.validation_audio_duration)::numeric/3600, 3)  as total_validations
from contributions_and_demo_stats_new contributions_and_demo_stats where $1:raw
group by contributions_and_demo_stats.type;`;

const cumulativeDataByState = "select state, total_speakers, total_contributions, total_validations from state_group_contributions where $1:raw;";

const cumulativeDataByLanguage = "select language, total_speakers,ROUND(total_contributions::numeric/3600,3) as total_contributions,ROUND(total_validations::numeric/3600, 3) as total_validations from language_group_contributions where $1:raw;";

const cumulativeDataByLanguageAndState = "select state, language, total_speakers, ROUND(total_contributions::numeric/3600,3) as total_contributions, total_validations from language_and_state_group_contributions where $1:raw;";

const listLanguages = "select distinct(language) from contributions_and_demo_stats_new where $1:raw;";

const topLanguagesBySpeakerContributions = "select language, total_speakers from language_group_contributions where $1:raw ORDER BY total_speakers DESC LIMIT 5;";

const topLanguagesByHoursContributed = "select language,ROUND(total_contributions::numeric/3600, 3) as total_contributions from language_group_contributions where $1:raw ORDER BY total_contributions DESC LIMIT 5;";

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
    lastUpdatedAtQuery
};