export dataset_path=$1
export dataset_name=$2
export bucket=$3
export remote_base_path=$4
export paired=$5
export connection=$6

export pub_path=${dataset_path}
export bundle_path=s3://${bucket}/$remote_base_path/${language}/original/bundled/$dataset_name.csv
aws s3 cp $dataset_path $bundle_path

node ingest.js $dataset_path $paired $connection $bundle_path {}