const ageGroupContributions = "select age_group, count(*) as contributions, ROUND(count(*)::decimal *6/3600,3) as hours_contributed, count(distinct(contributed_by)) as speakers from contributions_and_demo_stats where $1:raw group by age_group ORDER BY contributions DESC;";

const genderGroupContributions = "select gender,count(*) as contributions,ROUND(count(*)::decimal *6/3600,3) as hours_contributed, count(distinct(contributed_by)) as speakers from contributions_and_demo_stats where $1:raw group by gender ORDER BY contributions DESC;";

const dailyTimeline = "select day, month, year, language, ROUND(cumulative_contributions::decimal *6/3600,3) as cumulative_contributions,ROUND(cumulative_validations::decimal *6/3600,3) as cumulative_validations from daily_cumulative_stats_per_language where $1:raw;";

const dailyTimelineCumulative = "select day, month, year, ROUND(cumulative_contributions::decimal *6/3600,3) as cumulative_contributions,ROUND(cumulative_validations::decimal *6/3600,3) as cumulative_validations from daily_cumulative_stats_all;";

const weeklyTimeline = "select year, week,language, ROUND(cumulative_contributions::decimal *6/3600,3) as cumulative_contributions,ROUND(cumulative_validations::decimal *6/3600,3) as cumulative_validations from weekly_cumulative_stats_per_language where $1:raw;";

const weeklyTimelineCumulative = "SELECT year, week, ROUND(cumulative_contributions::decimal *6/3600,3) as cumulative_contributions,ROUND(cumulative_validations::decimal *6/3600,3) as cumulative_validations FROM weekly_cumulative_stats_all;";

const monthlyTimeline = "select year, month, language, ROUND(cumulative_contributions::decimal *6/3600,3) as cumulative_contributions,ROUND(cumulative_validations::decimal *6/3600,3) as cumulative_validations from monthly_cumulative_stats_per_language where $1:raw;";

const monthlyTimelineCumulative = "SELECT year, month, ROUND(cumulative_contributions::decimal *6/3600,3) as cumulative_contributions,ROUND(cumulative_validations::decimal *6/3600,3) as cumulative_validations FROM monthly_cumulative_stats_all;";

const quarterlyTimeline = "select year, quarter, language, ROUND(cumulative_contributions::decimal *6/3600,3) as cumulative_contributions,ROUND(cumulative_validations::decimal *6/3600,3) as cumulative_validations from quarterly_cumulative_stats_per_language where $1:raw;";//"select year, month,language, ROUND(cumulative_contributions::decimal *6/3600,3) as cumulative_contributions,ROUND(cumulative_validations::decimal *6/3600,3) as cumulative_validations from monthly_cumulative_stats_per_language where $1:raw ORDER BY year DESC,month DESC LIMIT 3;";

const quarterlyTimelineCumulative = "SELECT year, quarter, ROUND(cumulative_contributions::decimal *6/3600,3) as cumulative_contributions,ROUND(cumulative_validations::decimal *6/3600,3) as cumulative_validations FROM quarterly_cumulative_stats_all;";//"SELECT year, month, ROUND(cumulative_contributions::decimal *6/3600,3) as cumulative_contributions,ROUND(cumulative_validations::decimal *6/3600,3) as cumulative_validations FROM monthly_cumulative_stats_all ORDER BY year DESC,month DESC LIMIT 3;";

const cumulativeCount = "select count(distinct(language)) as total_languages, count(distinct(contributed_by)) as total_speakers,ROUND(count(distinct(contribution_id))::decimal *6/3600,3)  as total_contributions,ROUND(sum(is_validated)::decimal *6/3600,3)  as total_validations from contributions_and_demo_stats;";

const cumulativeDataByState = "select state_region as state,count(distinct(contributed_by)) as total_speakers,ROUND(count(distinct(contribution_id))::decimal *6/3600,3)  as total_contributions,ROUND(sum(is_validated)::decimal *6/3600,3)  as total_validations from contributions_and_demo_stats group by state_region;";

const cumulativeDataByLanguage = "select language,count(distinct(contributed_by)) as total_speakers,ROUND(count(distinct(contribution_id))::decimal *6/3600,3)  as total_contributions,ROUND(sum(is_validated)::decimal *6/3600,3)  as total_validations from contributions_and_demo_stats group by language;";

const cumulativeDataByLanguageAndState = "select state_region as state,language,count(distinct(contributed_by)) as total_speakers,ROUND(count(distinct(contribution_id))::decimal *6/3600,3)  as total_contributions,ROUND(sum(is_validated)::decimal *6/3600,3)  as total_validations from contributions_and_demo_stats group by state_region,language;";

const listLanguages = "select distinct(language) from contributions_and_demo_stats;";

const topLanguagesBySpeakerContributions = "select language,count(distinct(contributed_by)) as total_speakers from contributions_and_demo_stats group by language ORDER BY total_speakers DESC LIMIT 5;";

const topLanguagesByHoursContributed = "select language,ROUND(count(distinct(contribution_id))::decimal *6/3600,3)  as total_contributions from contributions_and_demo_stats group by language ORDER BY total_contributions DESC LIMIT 5;";


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
    quarterlyTimelineCumulative
};