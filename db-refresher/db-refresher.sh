#!/bin/bash 

echo "Db refresh Initiating...";
cd /usr/src/app/tb_files

alias urlencode='python3 -c "import sys, urllib.parse as ul; \
    print (ul.quote_plus(sys.argv[1]))"'

DB_USER=$(urlencode $DB_USER)
DB_PASS=$(urlencode $DB_PASS)

psql -v ON_ERROR_STOP=1 "postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}" -f /Users/heerabal/speech-recognition/crowdsource-dataplatform/db-refresher/db_refresh.sql  || exit 1
echo "Db refresh Complete!"
psql -v ON_ERROR_STOP=1 "postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}" -f /Users/heerabal/speech-recognition/crowdsource-dataplatform/db-refresher/db_queries.sql ||  exit 1
echo "Jsons update Complete!"
ls -lrt

keyctl session

ls -al /usr/src/app/utils/

/usr/src/app/utils/azcopy login --tenant-id ${AZURE_TENANT_ID} --service-principal --application-id ${AZURE_APP_ID}

if [ "$ENVIRONMENT" = "prod" ]
then
   /usr/src/app/utils/azcopy copy "./*" "${AZURE_ACC_URL}/${BUCKET_NAME}/bhashadaan/aggregated-json/" --recursive --include-pattern "*json"
else
   /usr/src/app/utils/azcopy copy "./*" "${AZURE_ACC_URL}/${BUCKET_NAME}/aggregated-json/" --recursive --include-pattern "*json"
fi

