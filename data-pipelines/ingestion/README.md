# Dataset Ingestion

## Process

1. Download (manual/script)
2. Extract
3. Upload to Azure buckets
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
sh ingest.sh  <TAR_FILE_NAME> <AZURE_BUCKET> <LANGUAGE> <GCP_REMOTE_BASE_PATH> paired $db_url $ulca_dataset_path $user
```

Example:

```sh
sh ingest.sh  ALL_INDIA_RADIO_BANGALORE <AZURE_BUCKET> Kannada inbound/asr paired $db_url gs://<GCP_BUCKET>/data/audiotospeech/integration/publish/kannada <USER>
```

## OCR dataset Ingestion

Command:

```sh
sh ingest.sh <GCP_REMOTE_BASE_PATH> <NAME> <BUCKET> <LANGUAGE> <REMOTE_BASE_PATH> <paired|unpaired> <CONNECTION_URL> <USER>
```

Example:

```sh
sh ingest.sh gs://<GCP_BUCKET>/data/ 8_2019_6_1506_13125_Judgement_12-Mar-2019_HIN ekstepspeechrecognition-crowdsource-dev Hindi inbound/ocr unpaired postgres://username:password@host:port/dbname test-user
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

Command for xlsx:

```sh
sh ingest_parallel.sh <GCP_REMOTE_BASE_PATH> <DATASET_FILE_PATH> <DATASET_NAME> <BUCKET> <REMOTE_BASE_PATH> <paired|unpaired> <CONNECTION_URL> <pair> <profanity_check_required> <format:xlsx|csv> <USER>

```
Example
```sh
sh ingest_parallel.sh gs://<GCP_BUCKET>/data/ parallel_en_pa.xlsx en_pa_edu $bucket inbound/parallel paired $db_url 'English:Punjabi' 'false' 'xlsx' 'test-user'
```

## Text dataset Ingestion

Command:

```sh
sh ingest.sh <GCP_REMOTE_BASE_PATH> <NAME> <BUCKET> <REMOTE_BASE_PATH> <paired|unpaired> <CONNECTION_URL> <LANGUAGE> <USER>
```

Example:

```sh
sh ingest.sh gs://<GCP_BUCKET>/data/ hi_source_textfile ekstepspeechrecognition-crowdsource-dev inbound/text unpaired postgres://username:password@host:port/dbname Hindi test-user
```

## Steps to Run Data Ingestion Script in VM

### Prerequisites

- az login with credentials


### Run Ingestion Script for Data Ingestion

 For text/asr/ocr types -
```sh
az vm run-command invoke -g <RESOURCE_GROUP> -n <VM_NAME> --command-id RunShellScript --scripts "cd /home/azureuser/data-pipelines/ingestion && sh ingest.sh <TYPE> <LANGUAGE> <GCP_REMOTE_BASE_PATH> <DATASET_NAME> <BUCKET> <AZURE_REMOTE_BASE_PATH> <paired|unpaired> <CONNECTION_URL> <USER>"
```

 For parallel -
```sh
az vm run-command invoke -g <RESOURCE_GROUP> -n <VM_NAME> --command-id RunShellScript --scripts "cd /home/azureuser/data-pipelines/ingestion && sh ingest.sh <TYPE> <LANGUAGE> <GCP_REMOTE_BASE_PATH> <DATASET_NAME> <BUCKET> <AZURE_REMOTE_BASE_PATH> <paired|unpaired> <CONNECTION_URL> <USER> <DATASET_FILE_NAME>"
```

### Examples -

1. ASR example
```sh
az vm run-command invoke -g az-resource-group -n az-vm --command-id RunShellScript --scripts "cd /home/azureuser/data-pipelines/ingestion && sh ingest.sh asr Malayalam gs://<GCP_BUCKET_NAME>/asr_data Josh_talks_malayalam ekstepspeechrecognition-crowdsource-dev inbound/asr paired postgres://username:password@host:port/dbname admin_user"
```

2. OCR example
```sh
az vm run-command invoke -g <RESOURCE_GROUP> -n <VM_NAME> --command-id RunShellScript --scripts "cd /home/azureuser/data-pipelines/ingestion && sh ingest.sh ocr Hindi gs://<GCP_BUCKET_NAME>/ocr_data 9123_hi-1-25_hi ekstepspeechrecognition-crowdsource-dev inbound/ocr paired postgres://username:password@host:port/dbname admin_user"
```

3. Parallel example
```sh
az vm run-command invoke -g <RESOURCE_GROUP> -n <VM_NAME> --command-id RunShellScript --scripts "cd /home/azureuser/data-pipelines/ingestion && sh ingest.sh parallel English:Hindi gs://<GCP_BUCKET_NAME>/parallel_data en_hi_edu ekstepspeechrecognition-crowdsource-dev inbound/parallel paired postgres://username:password@host:port/dbname admin_user excel_filename.xlsx"
```

4. Text example
```sh
az vm run-command invoke -g <RESOURCE_GROUP> -n <VM_NAME> --command-id RunShellScript --scripts "cd /home/azureuser/data-pipelines/ingestion && sh ingest.sh text Hindi gs://<GCP_BUCKET_NAME>/text_data source_textfile ekstepspeechrecognition-crowdsource-dev inbound/text unpaired postgres://username:password@host:port/dbname admin_user"
```