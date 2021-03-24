#!/bin/bash
echo "Db refresh Initiating...";
echo "REFRESH MATERIALIZED VIEW contributions_and_demo_stats;" > db_refresh.sql
echo "INSERT INTO audit_load_log(tablename,username,command)  values('contributions_and_demo_stats','root','REFRESH');" >> db_refresh.sql
echo "REFRESH MATERIALIZED VIEW daily_stats_complete;" >> db_refresh.sql
echo "INSERT INTO audit_load_log(tablename,username,command) values('daily_stats_complete','root','REFRESH');" >> db_refresh.sql
cat db_refresh.sql;
psql "postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}" -f db_refresh.sql
echo "Db refresh Complete!"
ls /usr/src/app
psql "postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}" -f db_queries.sql
echo "Jsons update Complete!"
ls -lrt
aws --version
