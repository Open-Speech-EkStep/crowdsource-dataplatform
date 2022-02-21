export source_dataset_path=$1
export dataset_file_path=$2
export dataset_name=$3
export bucket=$4
export remote_base_path=$5
export paired=$6
export connection=$7
export pairs=$8
export profanity_check_required=$9
export format=$10
export user=$11

gsutil cp ${source_dataset_path}/${dataset_name}/${dataset_file_path} .

export bundle_path=${AZURE_ACC_URL}/${bucket}/$remote_base_path/${language}/original/bundled/${dataset_name}/${dataset_file_path}

node ingest.js $dataset_file_path $paired $connection $bundle_path {} $pairs $profanity_check_required $format $user

azcopy copy $dataset_file_path $bundle_path

rm -rf ${dataset_file_path}
