export bucket_name=$1
export language=$2
export connection=$3

export now=$(date +"%d-%m-%y")
export export_dir=$(pwd)/$language/$language'_asr_export_'$now

mkdir -p $export_dir

node export.js $language $connection $export_dir

awk -v bucket_name=$bucket_name -v export_dir=$export_dir '{print "aws s3 sync s3://"bucket_name"/"$1 " "export_dir""}' audio_paths.txt | sh

tar -pvczf $export_dir.tar.gz $export_dir 

rm -rf $export_dir
