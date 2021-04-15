/* EPLACE with your SQL commands */

CREATE OR REPLACE VIEW daily_cumulative_stats_per_language AS (select
  language,year,month,day,
  sum(total_contributions) over (partition by language order by year,month,day asc rows between unbounded preceding and current row) as cumulative_contributions,
  sum(total_validations) over (partition by language order by year,month,day asc rows between unbounded preceding and current row) as cumulative_validations 
from daily_stats_complete);

CREATE OR REPLACE VIEW  daily_cumulative_stats_all
AS (WITH daily_stats_all AS( select year,month,day, sum(total_contributions) as  total_contributions,sum(total_validations) as total_validations FROM daily_stats_complete group by year,month,day order by year,month,day)
select
  year,month,day,
  sum(total_contributions)  over (order by year,month,day asc rows between unbounded preceding and current row) as cumulative_contributions,
  sum(total_validations)  over (order by year,month,day asc rows between unbounded preceding and current row) as cumulative_validations 
from daily_stats_all);


CREATE OR REPLACE VIEW weekly_stats_complete AS (
SELECT language,
     year,
       date_part('week', make_date(year::int, month::int, day::int)::date) AS week,
     sum(total_contributions) as total_contributions,sum(total_validations) as total_validations
     from daily_stats_complete group by language,year,week);


CREATE OR REPLACE VIEW weekly_cumulative_stats_per_language AS (select
  language,year,week,
  sum(total_contributions) over (partition by language order by year,week asc rows between unbounded preceding and current row) as cumulative_contributions,
  sum(total_validations) over (partition by language order by year,week asc rows between unbounded preceding and current row) as cumulative_validations 
from weekly_stats_complete);


CREATE OR REPLACE VIEW  weekly_cumulative_stats_all
AS (WITH weekly_stats_all AS( select year,week,sum(total_contributions) as  total_contributions,sum(total_validations) as total_validations FROM weekly_stats_complete group by year,week order by year,week)
select
  year,week,
  sum(total_contributions)  over (order by year,week asc rows between unbounded preceding and current row) as cumulative_contributions,
  sum(total_validations)  over (order by year,week asc rows between unbounded preceding and current row) as cumulative_validations 
from weekly_stats_all);


CREATE OR REPLACE VIEW monthly_stats_complete AS (
SELECT language,
     year,
     month,
     sum(total_contributions) as total_contributions,sum(total_validations) as total_validations
     from daily_stats_complete group by language,year,month);


CREATE OR REPLACE VIEW monthly_cumulative_stats_per_language AS (select
  language,year,month,
  sum(total_contributions) over (partition by language order by year,month asc rows between unbounded preceding and current row) as cumulative_contributions,
  sum(total_validations) over (partition by language order by year,month asc rows between unbounded preceding and current row) as cumulative_validations 
from monthly_stats_complete);


CREATE OR REPLACE VIEW monthly_cumulative_stats_all AS (
  WITH monthly_stats_all AS (select year,month,sum(total_contributions) as  total_contributions,sum(total_validations) as total_validations FROM monthly_stats_complete group by year,month order by year,month)
select
  year,month,
  sum(total_contributions)  over (order by year,month asc rows between unbounded preceding and current row) as cumulative_contributions,
  sum(total_validations)  over (order by year,month asc rows between unbounded preceding and current row) as cumulative_validations 
from monthly_stats_all);