#!/bin/bash
echo "Db refresh Initiating...";
cd /usr/src/app/tb_files
psql "postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}" -f /usr/src/app/db_refresh.sql
echo "Db refresh Complete!"
psql "postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}" -f /usr/src/app/db_queries.sql
echo "Jsons update Complete!"
ls -lrt
aws s3 cp . s3://${BUCKET_NAME}/database_snapshot_files/ --recursive --exclude "*" --include "*json"
