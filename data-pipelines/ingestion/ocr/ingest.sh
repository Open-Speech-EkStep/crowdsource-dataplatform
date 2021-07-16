export dataset_path=$1
export dataset_name=$2
export bucket=$3
export language=$4
export remote_base_path=$5
export paired=$6
export connection=$7

export pub_path=${dataset_path}
export bundle_path=$AZURE_ACC_URL/${bucket}/$remote_base_path/${language}/original/bundled/$dataset_name.tar.gz
tar -czvf $dataset_name.tar.gz $dataset_path

ls $pub_path/ | grep '.png'| awk -v path=${pub_path}/ '{print path$1}'  > ocr_files.txt

azcopy copy "$pub_path/*" ${AZURE_ACC_URL}/${bucket}/$remote_base_path/${language}/${dataset_name}

node ingest.js $dataset_path $bundle_path $remote_base_path $language $paired $connection

azcopy copy $dataset_name.tar.gz $bundle_path
