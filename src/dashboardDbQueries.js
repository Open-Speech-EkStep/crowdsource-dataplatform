const ageGroupContributionsOld = "select age_group, count(*) as contributions, ROUND(count(*)::decimal *6/3600,3) as hours_contributed, count(distinct(contributed_by)) as speakers from contributions_and_demo_stats where $1:raw group by age_group ORDER BY contributions DESC;";
const ageGroupContributions = "select age_group, count(*) as contributions, ROUND(sum(contribution_audio_duration)::decimal/3600, 3) as hours_contributed,ROUND(sum(validation_audio_duration)::decimal/3600, 3) as hours_validated, count(distinct(contributed_by)) as speakers from contributions_and_demo_stats where $1:raw group by age_group ORDER BY contributions DESC;";

const genderGroupContributionsOld = "select gender,count(*) as contributions,ROUND(count(*)::decimal *6/3600,3) as hours_contributed, count(distinct(contributed_by)) as speakers from contributions_and_demo_stats where $1:raw group by gender ORDER BY contributions DESC;";
const genderGroupContributions = "select gender,count(*) as contributions, ROUND(sum(contribution_audio_duration)::decimal/3600, 3) as hours_contributed,ROUND(sum(validation_audio_duration)::decimal/3600, 3) as hours_validated, count(distinct(contributed_by)) as speakers from contributions_and_demo_stats where $1:raw group by gender ORDER BY contributions DESC;";

const dailyTimelineOld = "select day, month, year, language, ROUND(cumulative_contributions::decimal *6/3600,3) as cumulative_contributions,ROUND(cumulative_validations::decimal *6/3600,3) as cumulative_validations from daily_cumulative_stats_per_language where $1:raw;";
const dailyTimeline = "select day, month, year, language, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations from daily_cumulative_stats_per_language where $1:raw;";

const dailyTimelineCumulativeOld = "select day, month, year, ROUND(cumulative_contributions::decimal *6/3600,3) as cumulative_contributions,ROUND(cumulative_validations::decimal *6/3600,3) as cumulative_validations from daily_cumulative_stats_all;";
const dailyTimelineCumulative = "select day, month, year, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations from daily_cumulative_stats_all;";

const weeklyTimelineOld = "select year, week,language, ROUND(cumulative_contributions::decimal *6/3600,3) as cumulative_contributions,ROUND(cumulative_validations::decimal *6/3600,3) as cumulative_validations from weekly_cumulative_stats_per_language where $1:raw;";
const weeklyTimeline = "select year, week,language, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations from weekly_cumulative_stats_per_language where $1:raw;";

const weeklyTimelineCumulativeOld = "SELECT year, week, ROUND(cumulative_contributions::decimal *6/3600,3) as cumulative_contributions,ROUND(cumulative_validations::decimal *6/3600,3) as cumulative_validations FROM weekly_cumulative_stats_all;";
const weeklyTimelineCumulative = "SELECT year, week, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations FROM weekly_cumulative_stats_all;";

const monthlyTimelineOld = "select year, month, language, ROUND(cumulative_contributions::decimal *6/3600,3) as cumulative_contributions,ROUND(cumulative_validations::decimal *6/3600,3) as cumulative_validations from monthly_cumulative_stats_per_language where $1:raw;";
const monthlyTimeline = "select year, month, language, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations from monthly_cumulative_stats_per_language where $1:raw;";

const monthlyTimelineCumulativeOld = "SELECT year, month, ROUND(cumulative_contributions::decimal *6/3600,3) as cumulative_contributions,ROUND(cumulative_validations::decimal *6/3600,3) as cumulative_validations FROM monthly_cumulative_stats_all;";
const monthlyTimelineCumulative = "SELECT year, month, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations FROM monthly_cumulative_stats_all;";

const quarterlyTimelineOld = "select year, quarter, language, ROUND(cumulative_contributions::decimal *6/3600,3) as cumulative_contributions,ROUND(cumulative_validations::decimal *6/3600,3) as cumulative_validations from quarterly_cumulative_stats_per_language where $1:raw;";
const quarterlyTimeline = "select year, quarter, language, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations from quarterly_cumulative_stats_per_language where $1:raw;";//"select year, month,language, ROUND(cumulative_contributions::decimal *6/3600,3) as cumulative_contributions,ROUND(cumulative_validations::decimal *6/3600,3) as cumulative_validations from monthly_cumulative_stats_per_language where $1:raw ORDER BY year DESC,month DESC LIMIT 3;";

const quarterlyTimelineCumulativeOld = "SELECT year, quarter, ROUND(cumulative_contributions::decimal *6/3600,3) as cumulative_contributions,ROUND(cumulative_validations::decimal *6/3600,3) as cumulative_validations FROM quarterly_cumulative_stats_all;";
const quarterlyTimelineCumulative = "SELECT year, quarter, ROUND(cumulative_contribution_duration::decimal/3600, 3) as cumulative_contributions,ROUND(cumulative_validation_duration::decimal/3600, 3) as cumulative_validations FROM quarterly_cumulative_stats_all;";//"SELECT year, month, ROUND(cumulative_contributions::decimal *6/3600,3) as cumulative_contributions,ROUND(cumulative_validations::decimal *6/3600,3) as cumulative_validations FROM monthly_cumulative_stats_all ORDER BY year DESC,month DESC LIMIT 3;";

const cumulativeCountOld = "select count(distinct(language)) as total_languages, count(distinct(contributed_by)) as total_speakers,ROUND(count(distinct(contribution_id))::decimal *6/3600,3)  as total_contributions,ROUND(sum(is_validated)::decimal *6/3600,3)  as total_validations from contributions_and_demo_stats;";
// Distinct(contribution id causes issues)
const cumulativeCount = "select count(distinct(language)) as total_languages, count(distinct(contributed_by)) as total_speakers,ROUND(count(distinct(contribution_id))::decimal *6/3600,3)  as total_contributions,ROUND(sum(is_validated)::decimal *6/3600,3)  as total_validations from contributions_and_demo_stats;";

// Distinct(contribution id causes issues)
const cumulativeDataByState = "select contributions_state_region as state,count(distinct(contributed_by)) as total_speakers,ROUND(count(distinct(contribution_id))::decimal *6/3600,3)  as total_contributions,ROUND(sum(is_validated)::decimal *6/3600,3)  as total_validations from contributions_and_demo_stats group by contributions_state_region;";

// Distinct(contribution id causes issues)
const cumulativeDataByLanguage = "select language,count(distinct(contributed_by)) as total_speakers,ROUND(count(distinct(contribution_id))::decimal *6/3600,3)  as total_contributions,ROUND(sum(is_validated)::decimal *6/3600,3)  as total_validations from contributions_and_demo_stats group by language;";

// Distinct(contribution id causes issues)
const cumulativeDataByLanguageAndState = "select contributions_state_region as state,language,count(distinct(contributed_by)) as total_speakers,ROUND(count(distinct(contribution_id))::decimal *6/3600,3)  as total_contributions,ROUND(sum(is_validated)::decimal *6/3600,3)  as total_validations from contributions_and_demo_stats group by contributions_state_region,language;";

const listLanguages = "select distinct(language) from contributions_and_demo_stats;";

const topLanguagesBySpeakerContributions = "select language,count(distinct(contributed_by)) as total_speakers from contributions_and_demo_stats group by language ORDER BY total_speakers DESC LIMIT 5;";

// Distinct(contribution id causes issues)
const topLanguagesByHoursContributed = "select language,ROUND(count(distinct(contribution_id))::decimal *6/3600,3)  as total_contributions from contributions_and_demo_stats group by language ORDER BY total_contributions DESC LIMIT 5;";

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