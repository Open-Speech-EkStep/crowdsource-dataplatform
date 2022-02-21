export asr_bundle_path=$1
export bucket=$2
export language=$3
export remote_base_path=$4
export paired=$5
export connection=$6
export ulca_dataset_path=$7
export user=$8

dataset_name=$(basename ${asr_bundle_path} .zip)

gsutil cp ${ulca_dataset_path}/${dataset_name}.zip .

export remote_bundle_path=${AZURE_ACC_URL}/${bucket}/$remote_base_path/${language}/original/bundled/${dataset_name}.tar.gz

unzip $asr_bundle_path

ls ${dataset_name} | grep '.wav'| awk -v path=${dataset_name}/ '{print path$1}'  > asr_files.txt

echo pushing dataset to: ${AZURE_ACC_URL}/${bucket}/$remote_base_path/${language}/${dataset_name}

azcopy copy $dataset_name ${AZURE_ACC_URL}/${bucket}/$remote_base_path/${language}/ --recursive

node ingest.js $dataset_name $remote_bundle_path $remote_base_path $language $paired $connection $user

azcopy copy $asr_bundle_path.zip $remote_bundle_path

rm -rf $dataset_name

rm -rf ${dataset_name}.zip