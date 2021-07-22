export dataset_path=$1
export dataset_name=$2
export bucket=$3
export language=$4
export remote_base_path=$5
export paired=$6
export connection=$7

export pub_path=/tmp/${dataset_name}
export bundle_path=${AZURE_ACC_URL}/${bucket}/$remote_base_path/${language}/original/bundled/$dataset_name.tar.gz
tar -czvf $dataset_name.tar.gz $dataset_path
azcopy copy $dataset_name.tar.gz $bundle_path

mkdir -p $pub_path
echo 'flattening at: '$pub_path

find ${dataset_path} -name "*.wav" -exec cp -v "{}" $pub_path/ \;
find ${dataset_path} -name "*.txt" -exec cp -v "{}" $pub_path/ \;

ls $pub_path/ |  awk -v path=${pub_path}/ '{print path$1}'  > asr_files.txt

echo pushing dataset to: s3://${bucket}/$remote_base_path/${language}/${dataset_name}

azcopy copy ${pub_path} "${AZURE_ACC_URL}/${bucket}/$remote_base_path/${language}/${dataset_name}" --recursive

node ingest.js {} $bundle_path $remote_base_path $language $paired $connection

rm -rf $pub_path
rm $dataset_name.tar.gz