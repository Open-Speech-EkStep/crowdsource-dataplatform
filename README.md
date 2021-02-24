# ektep-crowdsource-platform
This will hold the crowdsourcing platform to be used to store voice data from various speakers 

##Pre-requisite
Access to GCP
Access to env variables

## steps to run app in your machine
### step 1 
download postgresql : https://cloud.google.com/sdk/docs/install#mac
### step 2
Run the script (from the root of the folder you extracted in the last step) using this command:
./google-cloud-sdk/install.sh
### step 3
cloudsqlPath is the absolute path where cloudsql has downloaded in your machine
nohup ./cloud_sql_proxy -dir=cloudsqlPath/cloudsql -instances=ekstepspeechrecognition:us-central1:crowdsourcedb=tcp:5432 &
### step 4
To get postgres client, download postico from https://eggerapps.at/postico/



