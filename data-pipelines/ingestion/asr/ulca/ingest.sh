export asr_bundle_path=$1
export bucket=$2
export language=$3
export remote_base_path=$4
export paired=$5
export connection=$6
export ulca_dataset_path=$7

dataset_name=$(basename ${asr_bundle_path} .tar.gz)

gsutil cp ${ulca_dataset_path}/${dataset_name}.tar.gz .

export remote_bundle_path=s3://${bucket}/$remote_base_path/${language}/original/bundled/${dataset_name}.tar.gz

tar -xzvf $asr_bundle_path

ls ${dataset_name} | grep '.wav'| awk -v path=${dataset_name}/ '{print path$1}'  > asr_files.txt

echo pushing dataset to: s3://${bucket}/$remote_base_path/${language}/${dataset_name}

aws s3 cp ${dataset_name}  s3://${bucket}/$remote_base_path/${language}/${dataset_name} --recursive

node ingest.js $dataset_name $remote_bundle_path $remote_base_path $language $paired $connection

rm -rf $dataset_name

aws s3 cp $asr_bundle_path $remote_bundle_path

rm -rf ${dataset_name}.tar.gz
