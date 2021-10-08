# Dataset Ingestion

## Process

1. Download (manula/script)
2. Extract
3. Upload to Azure bukets
4. Update database

## Setup

## INSTALL AZCOPY: https://docs.microsoft.com/en-us/azure/storage/common/storage-use-azcopy-v10

```sh
export AZCOPY_SPA_CLIENT_SECRET=*******
export AZURE_ACC_URL=https://crowdsource1.blob.core.windows.net

azcopy login --tenant-id ******** --service-principal --application-id *******

azcopy cp "https://crowdsource1.blob.core.windows.net/ekstepspeechrecognition-crowdsource/" "https://crowdsource1.blob.core.windows.net/ekstepspeechrecognition-crowdsource-dev/" --recursive


## ASR dataset Ingestion

Command for ingestion (Non-ULCA compliant):

```sh
sh ingest.sh <LOCAL_PATH> <DATASET_NAME> <BUCKET_NAME> <LANGUAGE> <REMOTE_BASE_PATH> <paired|unpaired> <CONNECTION_URL>
 ```

Example:

```sh
sh ingest.sh ./CEC CEC ekstepspeechrecognition-crowdsource-dev Hindi inbound/asr paired postgres://username:password@host:port/dbname
```

Command for ingestion (ULCA compliant):

```sh
cd data-pipelines/ingestion/asr/ulca
```

```sh
sh ingest.sh  <TAR_FILE_NAME> <AWS_BUCKET> <LANGUAGE> <GCP_REMOTE_BASE_PATH> paired $db_url $ulca_dataset_path
```

Example:

```sh
sh ingest.sh  ALL_INDIA_RADIO_BANGALORE.tar.gz <AWS_BUKCET> Kannada inbound/asr paired $db_url gs://<GCP_BUCKET>/data/audiotospeech/integration/publish/kannada
```

## OCR dataset Ingestion

Command:

```sh
sh ingest.sh <LOCAL_PATH> <NAME> <BUCKET> <LANGUAGE> <REMOTE_BASE_PATH> <paired|unpaired> <CONNECTION_URL>
```

Example:

```sh
sh ingest.sh ./sample/8_2019_6_1506_13125_Judgement_12-Mar-2019_HIN/LINE 8_2019_6_1506_13125_Judgement_12-Mar-2019_HIN ekstepspeechrecognition-crowdsource-dev Hindi inbound/ocr unpaired postgres://username:password@host:port/dbname
```

## Parallel dataset Ingestion

Command for samanantar:

```sh
sh ingest.sh <LOCAL_PATH> <NAME> <BUCKET> <REMOTE_BASE_PATH> <paired|unpaired> <CONNECTION_URL> <PAIRS>
```

Example:

```sh
sh ingest.sh ./sample/parallel_3.csv parallel_1 ekstepspeechrecognition-crowdsource-dev inbound/parallel paired postgres://username:password@host:port/dbname '{"English-Malayalam":"1-10","English-Hindi":"1-10"}'
```

Command for xls:

```sh
sh ingest_parallel.sh <LOCAL_PATH> <NAME> <BUCKET> <REMOTE_BASE_PATh> <paired|unpaired> <CONNECTION_URL> <pair> <profanity_check_required> <format:xlsx|csv>

```
Example
```sh
sh ingest_parallel.sh /Users/rajats/Downloads/education_domain/parallel/xlsx/parallel_en_pa.xlsx en_pa_edu $bucket inbound/parallel paired $db_url 'English:Punjabi' 'false' 'xlsx'
```
