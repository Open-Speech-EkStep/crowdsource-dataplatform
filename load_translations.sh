#!/usr/bin/env bash

export json_input_folder='./crowdsource-fe/public/locales'
export delta_output_folder='./delta_out'
export views_folder_path='./crowdsource-fe/src'
export meta_output_folder='./meta_files'
export excel_sheet_path='./utils/localization/resources/backup/Bhasha_Daan_All_Content_December_1.xlsx'
export translation_output_path='./crowdsource-fe/public/locales'

export meta_file_location=$meta_output_folder/nextjs_meta.xlsx

echo "Creating Meta File"
mkdir -p $meta_output_folder
python ./utils/localization/delta_generator.py \
-i $json_input_folder \
-o $delta_output_folder \
-v $views_folder_path \
-a --all-keys --output-type SINGLE_SHEET
mv ./delta_out/out-meta/*.xlsx $meta_file_location

echo "Loading translations"
python ./utils/localization/locale_generator.py \
-j $json_input_folder \
-e $excel_sheet_path \
-m $meta_file_location \
-o $translation_output_path \
-t combined -a

echo "Clear files"
rm $meta_file_location
rm -r $delta_output_folder/*

echo "Format translation files"
cd crowdsource-fe
npm run format
