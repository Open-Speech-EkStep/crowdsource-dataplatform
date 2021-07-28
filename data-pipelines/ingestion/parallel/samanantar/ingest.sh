export dataset_path=$1
export dataset_name=$2
export bucket=$3
export remote_base_path=$4
export paired=$5
export connection=$6
export pairs=$7
export profanity_check_required=$8
export format=$9


export pub_path=${dataset_path}
export bundle_path=${AZURE_ACC_URL}/${bucket}/$remote_base_path/${language}/original/bundled/$dataset_name.csv

node ingest.js $dataset_path $paired $connection $bundle_path {} $pairs $profanity_check_required $format

azcopy copy $dataset_path $bundle_path
