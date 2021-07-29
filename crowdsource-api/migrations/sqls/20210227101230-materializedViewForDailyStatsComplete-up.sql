/* Replace with your SQL commands */

CREATE MATERIALIZED VIEW IF NOT EXISTS daily_stats_complete AS (
select language,date_part('year'::text, date) AS year,
    date_part('month'::text, date) AS month,
    date_part('day'::text, date) AS day,count(distinct(contribution_id)) as total_contributions,sum(is_validated)  as total_validations from contributions_and_demo_stats group by date,language ORDER BY date  );

REFRESH MATERIALIZED VIEW daily_stats_complete;
