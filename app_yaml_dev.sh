#!/bin/bash
echo """
runtime: nodejs
env: flex
service: dev
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
  DB_NAME: \"$DEV_DB_NAME\"
  DB_PASS: \"$DB_PASS\"
  BUCKET_NAME: \"$TEST_BUCKET_NAME\"
  ENCRYPTION_KEY: \"$ENCRYPTION_KEY\"
  AUTH_ISSUER_DOMAIN: \"$AUTH_ISSUER_DOMAIN\"
  AUTH0_CLIENT_ID: \"$AUTH0_CLIENT_ID\"
  AUTH0_CLIENT_SECRET: \"$AUTH0_CLIENT_SECRET\"
  SESSION_SECRET: \"$SESSION_SECRET\"
  API_AUDIENCE: \"$API_AUDIENCE\"
  AUTH0_CALLBACK_URL: \"$AUTH0_TEST_CALLBACK_URL\"
  AUTH0_ADMIN_LOGIN_URL: \"$AUTH0_ADMIN_LOGIN_URL\"


beta_settings:
  cloud_sql_instances: \"$DB_HOST\"
"""