import argparse
import os
from abc import ABC, abstractmethod

import pandas as pd

from helper.reader.excel_file_reader import ExcelReader
from helper.reader.json_file_reader import JsonReader
from helper.utils.utils import get_excel_files
from modules.locale_generator.utils import get_excel_files, \
    write_df_to_json, get_selected_languages, read_language_list


class ExcelInput(ABC):

    def __init__(self, input_json_path, meta_input_path):
        self.input_json_path = input_json_path
        self.meta_input_path = meta_input_path
        self.json_reader = JsonReader()
        self.excel_reader = ExcelReader()

    @abstractmethod
    def read_translation_file(self, language_code, columns):
        pass

    @abstractmethod
    def read_meta_file(self, language_code, columns):
        pass

    def read_json_file(self, language_code):
        json_path = '{input_json_path}/{locale}.json'.format(input_json_path=self.input_json_path, locale=language_code)
        return self.json_reader.read_as_df(json_path)


class SingleExcelInput(ExcelInput):

    def __init__(self, input_json_path, input_excel_path, meta_input_path):
        super().__init__(input_json_path, meta_input_path)
        self.input_json_path = input_json_path
        # file path
        self.input_excel_path = input_excel_path
        # file path
        self.meta_input_path = meta_input_path

    def read_meta_file(self, language_code, columns):
        return self.excel_reader.read_as_df(self.meta_input_path, columns)

    def read_translation_file(self, language_code, columns):
        return self.excel_reader.read_as_df(self.input_excel_path, columns)


class MultiExcelInput(ExcelInput):

    def __init__(self, input_json_path, input_base_path, meta_input_path):
        super().__init__(input_json_path, meta_input_path)
        self.input_json_path = input_json_path
        # folder path
        self.input_base_path = input_base_path
        # file path
        self.meta_input_path = meta_input_path

    def read_meta_file(self, language_code, columns):
        return self.excel_reader.read_as_df(os.path.join(self.meta_input_path, language_code + ".xlsx"), columns)

    def read_translation_file(self, language_code, columns=None):
        if columns is None:
            columns = []
        path_to_excels = os.path.join(self.input_base_path, language_code)
        translation_excel_files = get_excel_files(path_to_excels)
        excel_df = self.excel_reader.read_files(translation_excel_files, columns=columns)
        return excel_df


class LocaleProcessor:

    def __init__(self, language_name, english_column_name):
        self.language_name = language_name
        self.english_column_name = english_column_name
        self.allowed_values = ['x', 'y', 'z', 'u', 'v', 'w']
        self.a_tag_replacement = 'a-tag-replacement'

    def add_translation_if_present(self, df_row):
        if self.language_name in list(df_row.index):
            if pd.notnull(df_row[self.language_name]) and len(str(df_row[self.language_name]).strip()) != 0:
                df_row['value'] = df_row[self.language_name]
        return df_row

    def restructure_extracted_tags(self, df_row):
        column_names = list(df_row.index)
        for value in self.allowed_values:
            if value in column_names and pd.notna(df_row[value]):
                if self.language_name in column_names and pd.notna(df_row[self.language_name]):
                    df_row[self.language_name] = df_row[self.language_name].replace('<' + value + '>',
                                                                                    df_row[value])
                df_row[self.english_column_name] = df_row[self.english_column_name].replace('<' + value + '>',
                                                                                            df_row[value])

        if self.a_tag_replacement in column_names and self.language_name in column_names:
            if pd.notna(df_row[self.a_tag_replacement]):
                start_index = df_row[self.language_name].find('<a') + 2
                end_index = df_row[self.language_name].find('>')

                if self.language_name in column_names and pd.notna(df_row[self.language_name]):
                    df_row[self.language_name] = df_row[self.language_name][:start_index] + df_row[
                        self.a_tag_replacement] + \
                                                 df_row[self.language_name][end_index:]

                df_row[self.english_column_name] = df_row[self.english_column_name][:start_index] + df_row[
                    self.a_tag_replacement] + df_row[self.english_column_name][end_index:]

        return df_row

    def clean_translation_excel(self, df, language_name):
        columns = [self.english_column_name, language_name]
        for value in self.allowed_values:
            if value in df.columns:
                columns.append(value)
        filtered_sheet = df[columns]
        sheet_no_na = filtered_sheet.dropna(subset=[self.english_column_name], inplace=False)
        return sheet_no_na

    def clean_merged_excel(self, df, language_name):
        excel_df = df.copy()
        for i, row in excel_df.iterrows():
            if pd.notna(row[language_name]):
                row[language_name] = str(row[language_name]).strip()
        excel_df = excel_df.drop_duplicates(subset=['Key', self.english_column_name], keep='last')
        return excel_df

    def process_with_meta_info(self, excel_df, meta_excel_df):
        del meta_excel_df[self.language_name]
        excel_df = self.clean_translation_excel(excel_df, self.language_name)
        merged_excel_df = pd.merge(excel_df, meta_excel_df, on=self.english_column_name,
                                   how='inner')
        merged_excel_df = merged_excel_df.apply(self.restructure_extracted_tags, axis=1)
        merged_excel_df = self.clean_merged_excel(merged_excel_df, self.language_name)
        return merged_excel_df

    def merge_excel_and_json(self, excel_df, json_df):
        merged_df = pd.merge(excel_df, json_df, on="Key", how='right')
        merged_df = merged_df.apply(self.add_translation_if_present, axis=1)
        select_columns = ['Key', 'value']
        filtered_merged_df = merged_df[select_columns]
        final_df = filtered_merged_df.drop_duplicates(subset=['Key'], keep='first', inplace=False)
        return final_df

    def process(self, meta_excel_df, input_excel_df, json_df):
        excel_df = self.process_with_meta_info(input_excel_df, meta_excel_df)

        final_df = self.merge_excel_and_json(excel_df, json_df)

        return final_df


class LocaleGenerator:

    def __init__(self, excel_input: ExcelInput, languages):
        self.languages = languages
        self.excel_input = excel_input
        self.english_column_name = 'English copy'

    def generate(self):
        languages_output_map = {}
        for language_code, language_name in self.languages.items():
            locale_processor = LocaleProcessor(language_name, self.english_column_name)
            meta_excel_df = self.excel_input.read_meta_file(language_code,
                                                            columns=[self.english_column_name, language_name])
            input_excel_df = self.excel_input.read_translation_file(language_code, columns=[self.english_column_name,
                                                                                            language_name])
            json_df = self.excel_input.read_json_file(language_code)

            language_final_df = locale_processor.process(meta_excel_df, input_excel_df, json_df)
            languages_output_map[language_code] = language_final_df
        return languages_output_map


def main():
    all_languages_list = read_language_list()
    example = '''
            Example commands:
            
            For specific languages:
                python LocaleGenerator.py -j ./../all_keys_generator/out -e ./input_excel_files -m ./../delta_generation/out-meta -o ./output_json_files -l gu pa
            
            For all languages:
                python LocaleGenerator.py -j ./../all_keys_generator/out -e ./input_excel_files -m ./../delta_generation/out-meta -o ./output_json_files -a
        
            -j /Users/nireshkumarr/Documents/ekstep/crowdsource-dataplatform/utils/localisation_script/delta_generation/cleaned_jsons
            -e /Users/nireshkumarr/Documents/ekstep/crowdsource-dataplatform/utils/ofiles/sme-input
            -m /Users/nireshkumarr/Documents/ekstep/crowdsource-dataplatform/utils/ofiles/out-meta
            -o ./output_json_files 
            -t seperate
            -l hi
        
        '''

    parser = argparse.ArgumentParser(epilog=example,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("-a", "--all-languages", action="store_true", help="Generate delta for all languages")
    group.add_argument("-l", "--languages", nargs="+",
                       help="Generate delta for the languages mentioned by language codes(space separated)",
                       choices=list(all_languages_list.keys()))

    parser.add_argument("-e", "--excel-path", required=True, help="Input folder path with excel files present")
    parser.add_argument("-j", "--json-folder-path", required=True, help="Input folder path with json files present")
    parser.add_argument("-m", "--meta-folder-path", required=True,
                        help="Input folder path with meta files for the excels present")
    parser.add_argument("-t", "--type", default='seperate', help="Type of input excel file(s)",
                        choices=['seperate', 'combined'])
    parser.add_argument("-o", "--output-folder-path", required=True,
                        help="Output folder path where excels are generated")

    args = parser.parse_args(
        "-j /Users/nireshkumarr/Documents/ekstep/crowdsource-dataplatform/utils/localisation_script/delta_generation/cleaned_jsons \
            -e /Users/nireshkumarr/Documents/ekstep/crowdsource-dataplatform/utils/ofiles/sme-input \
            -m /Users/nireshkumarr/Documents/ekstep/crowdsource-dataplatform/utils/ofiles/out-meta \
            -o ./output_json_files \
            -t seperate \
            -l hi".split())

    languages = get_selected_languages(all_languages_list, args.all_languages, args.languages)

    input_base_path = args.excel_path
    input_json_path = args.json_folder_path
    meta_input_path = args.meta_folder_path
    output_base_path = args.output_folder_path

    file_type = args.type
    if file_type == 'combined' and not os.path.isfile(meta_input_path):
        print('Invalid arguments')
        exit()

    if file_type == 'combined':
        excel_input = SingleExcelInput(input_json_path, input_base_path, meta_input_path)
    else:
        excel_input = MultiExcelInput(input_json_path, input_base_path, meta_input_path)

    language_output_map = LocaleGenerator(excel_input, languages).generate()

    os.makedirs(output_base_path, exist_ok=True)
    for language_code, language_final_df in language_output_map.items():
        output_json_path = '{base_path}/{language}.json'.format(base_path=output_base_path, language=language_code)
        write_df_to_json(language_final_df, output_json_path)

        # move_files(path_to_excels, translation_excel_files)


if __name__ == '__main__':
    main()

# read json
# if json empty (should exit script but decided to allow)
# clean json df
# read meta excel
# if meta excel empty (should not allow - exit)
# clean excel df
# read sme excel
# if sme excel (should exit language procedure with message - No data found)
# clean excel df
# join meta and sme excel - merged excel
# if no data found, meta - sme mismatch error
# clean merged df
# join json and merged excel - final df
# clean final df
# filter and write final df
