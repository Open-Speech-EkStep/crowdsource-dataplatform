/* Replace with your SQL commands */

CREATE VIEW daily_cumulative_stats_per_language AS (select
  language,year,month,day,
  sum(total_contributions) over (partition by language order by year,month,day asc rows between unbounded preceding and current row) as cumulative_contributions,
  sum(total_validations) over (partition by language order by year,month,day asc rows between unbounded preceding and current row) as cumulative_validations,
  sum(total_contribution_duration) over (partition by language order by year,month,day asc rows between unbounded preceding and current row) as cumulative_contribution_duration,
  sum(total_validation_duration) over (partition by language order by year,month,day asc rows between unbounded preceding and current row) as cumulative_validation_duration
from daily_stats_complete);


CREATE VIEW  daily_cumulative_stats_all
AS (WITH daily_stats_all AS( select year,month,day, sum(total_contributions) as  total_contributions,sum(total_validations) as total_validations,sum(total_contribution_duration) as total_contribution_duration,sum(total_validation_duration) as total_validation_duration FROM daily_stats_complete group by year,month,day order by year,month,day)
select
  year,month,day,
  sum(total_contributions)  over (order by year,month,day asc rows between unbounded preceding and current row) as cumulative_contributions,
  sum(total_validations)  over (order by year,month,day asc rows between unbounded preceding and current row) as cumulative_validations,
  sum(total_contribution_duration) over (order by year,month,day asc rows between unbounded preceding and current row) as cumulative_contribution_duration, 
  sum(total_validation_duration) over (order by year,month,day asc rows between unbounded preceding and current row) as cumulative_validation_duration
from daily_stats_all);


CREATE VIEW weekly_stats_complete AS (
SELECT language,
     year,
       date_part('week', make_date(year::int, month::int, day::int)::date) AS week,
     sum(total_contributions) as total_contributions,sum(total_validations) as total_validations,
     sum(total_contribution_duration) as total_contribution_duration,sum(total_validation_duration) as total_validation_duration
     from daily_stats_complete group by language,year,week);


CREATE VIEW weekly_cumulative_stats_per_language AS (select
  language,year,week,
  sum(total_contributions) over (partition by language order by year,week asc rows between unbounded preceding and current row) as cumulative_contributions,
  sum(total_validations) over (partition by language order by year,week asc rows between unbounded preceding and current row) as cumulative_validations,
  sum(total_contribution_duration) over (partition by language order by year,week asc rows between unbounded preceding and current row) as cumulative_contribution_duration,
  sum(total_validation_duration) over (partition by language order by year,week asc rows between unbounded preceding and current row) as cumulative_validation_duration
from weekly_stats_complete);


CREATE VIEW  weekly_cumulative_stats_all
AS (WITH weekly_stats_all AS( select year,week,sum(total_contributions) as  total_contributions,sum(total_validations) as total_validations,sum(total_contribution_duration) as total_contribution_duration,sum(total_validation_duration) as total_validation_duration FROM weekly_stats_complete group by year,week order by year,week)
select
  year,week,
  sum(total_contributions)  over (order by year,week asc rows between unbounded preceding and current row) as cumulative_contributions,
  sum(total_validations)  over (order by year,week asc rows between unbounded preceding and current row) as cumulative_validations,
  sum(total_contribution_duration) over (order by year,week asc rows between unbounded preceding and current row) as cumulative_contribution_duration, 
  sum(total_validation_duration) over (order by year,week asc rows between unbounded preceding and current row) as cumulative_validation_duration
from weekly_stats_all);


CREATE OR REPLACE VIEW monthly_stats_complete AS (
SELECT language,
     year,
     month,
     sum(total_contributions) as total_contributions,sum(total_validations) as total_validations,
     sum(total_contribution_duration) as total_contribution_duration,sum(total_validation_duration) as total_validation_duration
     from daily_stats_complete group by language,year,month);


CREATE OR REPLACE VIEW monthly_cumulative_stats_per_language AS (select
  language,year,month,
  sum(total_contributions) over (partition by language order by year,month asc rows between unbounded preceding and current row) as cumulative_contributions,
  sum(total_validations) over (partition by language order by year,month asc rows between unbounded preceding and current row) as cumulative_validations,
  sum(total_contribution_duration) over (partition by language order by year,month asc rows between unbounded preceding and current row) as cumulative_contribution_duration,
  sum(total_validation_duration) over (partition by language order by year,month asc rows between unbounded preceding and current row) as cumulative_validation_duration
from monthly_stats_complete);


CREATE OR REPLACE VIEW  monthly_cumulative_stats_all
AS (WITH monthly_stats_all AS( select year,month,sum(total_contributions) as  total_contributions,sum(total_validations) as total_validations,sum(total_contribution_duration) as total_contribution_duration,sum(total_validation_duration) as total_validation_duration FROM monthly_stats_complete group by year,month order by year,month)
select
  year,month,
  sum(total_contributions)  over (order by year,month asc rows between unbounded preceding and current row) as cumulative_contributions,
  sum(total_validations)  over (order by year,month asc rows between unbounded preceding and current row) as cumulative_validations,
  sum(total_contribution_duration) over (order by year,month asc rows between unbounded preceding and current row) as cumulative_contribution_duration, 
  sum(total_validation_duration) over (order by year,month asc rows between unbounded preceding and current row) as cumulative_validation_duration
from monthly_stats_all);


CREATE OR REPLACE VIEW quarterly_stats_complete AS (
SELECT language,
     year,
	 date_part('quarter'::text,CONCAT(year,'-',month,'-',day)::date) as quarter,sum(total_contributions) as total_contributions,sum(total_validations) as total_validations,sum(total_contribution_duration) as total_contribution_duration,sum(total_validation_duration) as total_validation_duration from daily_stats_complete group by language,year,quarter);


CREATE OR REPLACE VIEW quarterly_cumulative_stats_per_language AS (select
  language,year,quarter,
  sum(total_contributions) over (partition by language order by year,quarter asc rows between unbounded preceding and current row) as cumulative_contributions,
  sum(total_validations) over (partition by language order by year,quarter asc rows between unbounded preceding and current row) as cumulative_validations,
  sum(total_contribution_duration) over (partition by language order by year,quarter asc rows between unbounded preceding and current row) as cumulative_contribution_duration,
  sum(total_validation_duration) over (partition by language order by year,quarter asc rows between unbounded preceding and current row) as cumulative_validation_duration
from quarterly_stats_complete);


CREATE OR REPLACE VIEW quarterly_cumulative_stats_all
AS (WITH quarterly_stats_all AS( select year,quarter,sum(total_contributions) as  total_contributions,sum(total_validations) as total_validations,sum(total_contribution_duration) as total_contribution_duration,sum(total_validation_duration) as total_validation_duration FROM quarterly_stats_complete group by year,quarter order by year,quarter)
select
  year,quarter,
  sum(total_contributions)  over (order by year,quarter asc rows between unbounded preceding and current row) as cumulative_contributions,
  sum(total_validations)  over (order by year,quarter asc rows between unbounded preceding and current row) as cumulative_validations,
  sum(total_contribution_duration) over (order by year,quarter asc rows between unbounded preceding and current row) as cumulative_contribution_duration, 
  sum(total_validation_duration) over (order by year,quarter asc rows between unbounded preceding and current row) as cumulative_validation_duration
from quarterly_stats_all);

