/* Replace with your SQL commands */

update contributors set age_group = 'upto 10' where age_group in ('00 - 13');

update contributors set age_group = '10 - 30' where age_group in ('13 - 17','18 - 29');

update contributors set age_group = '30 - 60' where age_group in ('30 - 39','40 - 49', '50 - 59');

update contributors set age_group = '60+' where age_group in ('60 - 64','65 - 74','> 75');

REFRESH MATERIALIZED VIEW contributions_and_demo_stats;

REFRESH MATERIALIZED VIEW daily_stats_complete;
