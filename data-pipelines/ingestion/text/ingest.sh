export source_dataset_path=$1
export dataset_name=$2
export bucket=$3
export remote_base_path=$4
export paired=$5
export connection=$6
export language=$7
export user=$8

export dataset_path=.

gsutil cp ${source_dataset_path}/${dataset_name}.txt ${dataset_path}

export bundle_path=${AZURE_ACC_URL}/${bucket}/$remote_base_path/${language}/original/bundled/$dataset_name.txt

node ingest.js $dataset_path/${dataset_name}.txt $paired $connection $bundle_path {} $language $user

azcopy copy $dataset_name.txt $bundle_path

rm -rf $dataset_name.txt
