#!/bin/bash
echo """
runtime: nodejs
env: flex

automatic_scaling:
  min_num_instances: 1
  max_num_instances: 2
  cool_down_period_sec: 70
  cpu_utilization:
    target_utilization: 0.8
resources:
  cpu: 1
  memory_gb: 0.5
  disk_size_gb: 10
env_variables:
  DB_HOST: \"/cloudsql/$DB_HOST\"
  DB_USER: \"$DB_USER\"
  DB_NAME: \"$DB_NAME\"
  DB_PASS: \"$DB_PASS\"
  BUCKET_NAME: \"$BUCKET_NAME\"
  ENCRYPTION_KEY: \"$ENCRYPTION_KEY\"

beta_settings:
  cloud_sql_instances: \"$DB_HOST\"
"""