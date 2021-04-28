## ASR Dataset Ingestion

Command for ingestion:

```sh
sh ingest.sh LOCAL_PATH DATASET_NAME BUCKET_NAME LANGUAGE REMOTE_BASE_PATh paired|unpaired postgres://username:password@host:port/dbname
 ```

Example:
```sh 
sh ingest.sh ./CEC CEC ekstepspeechrecognition-crowdsource-dev Hindi inbound/asr paired postgres://username:password@host:port/dbname
```