/* Replace with your SQL commands */

CREATE OR REPLACE VIEW quarterly_stats_complete AS (
SELECT language,
     year,
	 date_part('quarter'::text,CONCAT(year,'-',month,'-',day)::date) as quarter,sum(total_contributions) as total_contributions,sum(total_validations) as total_validations from daily_stats_complete group by language,year,quarter);


CREATE OR REPLACE VIEW quarterly_cumulative_stats_per_language AS (select
  language,year,quarter,
  sum(total_contributions) over (partition by language order by year,quarter asc rows between unbounded preceding and current row) as cumulative_contributions,
  sum(total_validations) over (partition by language order by year,quarter asc rows between unbounded preceding and current row) as cumulative_validations 
from quarterly_stats_complete);

CREATE OR REPLACE VIEW  quarterly_cumulative_stats_all
AS (WITH quarterly_stats_all AS( select year,quarter,sum(total_contributions) as  total_contributions,sum(total_validations) as total_validations FROM quarterly_stats_complete group by year,quarter order by year,quarter)
select
  year,quarter,
  sum(total_contributions)  over (order by year,quarter asc rows between unbounded preceding and current row) as cumulative_contributions,
  sum(total_validations)  over (order by year,quarter asc rows between unbounded preceding and current row) as cumulative_validations 
from quarterly_stats_all);