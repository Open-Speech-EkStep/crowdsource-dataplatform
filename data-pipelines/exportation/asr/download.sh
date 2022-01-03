export bucket_name=$1
export path=$2
export language=$3
export connection=$4

export now=$(date +"%d-%m-%y")
export export_dir=$(pwd)/$language/$language'_asr_export_'$now
export downloads_dir=$(pwd)/downloads/$language

mkdir -p $export_dir

node export.js $language $connection $export_dir

mkdir -p $downloads_dir

mv audio_paths.txt $language/

awk '{n=split($1,A,"/"); print A[n]}' $language/audio_paths.txt > $language/contributed_files.txt

aws s3 sync s3://$bucket_name/$path/$language/ $downloads_dir --include "*.wav" --exclude "*original*"

awk -v language=$language -v export_dir=$export_dir '{print "cp ./downloads/"language"/**/"$1" "export_dir"" }' ./$language/contributed_files.txt | sh

tar -pvczf $export_dir.tar.gz $export_dir
