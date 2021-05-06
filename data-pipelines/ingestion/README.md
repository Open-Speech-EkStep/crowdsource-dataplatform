## ASR Dataset Ingestion

Command for ingestion:

```sh
sh ingest.sh LOCAL_PATH DATASET_NAME BUCKET_NAME LANGUAGE REMOTE_BASE_PATh paired|unpaired postgres://username:password@host:port/dbname
 ```

Example:
```sh 
sh ingest.sh ./CEC CEC ekstepspeechrecognition-crowdsource-dev Hindi inbound/asr paired postgres://username:password@host:port/dbname
```

## OCR Dataset Ingestion

Command:

```sh 
sh ingest.sh LOCAL_PATH NAME BUCKET LANGUAGE REMOTE_BASE_PATH unpaired postgres://username:password@host:port/dbname
```

Example:
```sh
sh ingest.sh ./sample/8_2019_6_1506_13125_Judgement_12-Mar-2019_HIN/LINE 8_2019_6_1506_13125_Judgement_12-Mar-2019_HIN ekstepspeechrecognition-crowdsource-dev Hindi inbound/ocr unpaired postgres://username:password@host:port/dbname
```