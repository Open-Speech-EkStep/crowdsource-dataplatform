export type=$1
export language=$2
export source_dataset_path=$3
export dataset_name=$4
export bucket=$5
export remote_base_path=$6
export paired=$7
export connection=$8
export user=$9
export dataset_file_path=$10

case "$type" in
    "asr") 
    cd asr/ulca 
    sh ingest.sh $dataset_name $bucket $language $remote_base_path $paired $connection $source_dataset_path $user
    ;;
    "ocr") 
    cd ocr 
    sh ingest.sh $source_dataset_path $dataset_name $bucket $language $remote_base_path $paired $connection false $user
    ;;
    "parallel") 
    cd parallel 
    sh ingest.sh $source_dataset_path $dataset_file_path $dataset_name $bucket $remote_base_path $paired $connection $language false 'xlsx' $user
    ;;
    "text") 
    cd text 
    sh ingest.sh $source_dataset_path $dataset_name $bucket $remote_base_path $paired $connection $language $user 
    ;;
esac
