#!/usr/bin/env python
# coding: utf-8

# # Generate local files with the received delta translated excel files

# Read file in added data order.

# In[1]:


import pandas as pd
import pkg_resources
import json
import os
import glob
import argparse


def read_json(json_file_path):
    with open(json_file_path) as f:
        data = json.load(f)
    return data


def reformat_json(json_obj):
    json_dict = {}
    for key, value in json_obj:
        json_dict[key] = value
    return json_dict


def write_df_to_json(df, output_json_path):
    json_file = df.to_json(orient='values')
    json_string = json.loads(json_file)

    reformatted_json = reformat_json(json_string)

    with open(output_json_path, 'w') as f:
        f.write(json.dumps(reformatted_json, indent=4, ensure_ascii=False))


def load_json_as_df(json_data):
    out_df = pd.DataFrame(list(json_data.items()),
                          columns=['Key', 'value'])
    return out_df


# unused
def get_matched_count(excel_df, merged_df):
    count = 0
    for key in excel_df['Key']:
        for k_key in merged_df['Key']:
            if key == k_key:
                count += 1
                break
    return count


def read_excel_as_df(filename, columns: list):
    excel_df = pd.DataFrame([], columns=columns)
    excel = pd.ExcelFile(filename)
    for sheet_name in excel.sheet_names:
        sheet = excel.parse(sheet_name=sheet_name, header=1)
        if len(sheet.columns) == 0:
            continue
        excel_df = pd.concat([excel_df, sheet], axis=0)
    return excel_df


def read_excels_as_df(filenames, columns: list):
    excel_df = pd.DataFrame([], columns=columns)
    for excel_file_name in filenames:
        excel_file_df = read_excel_as_df(excel_file_name, columns)
        excel_df = pd.concat([excel_df, excel_file_df], axis=0)
    return excel_df


def excel_filter(excel_file_name):
    return os.path.isfile(excel_file_name) and excel_file_name.endswith('.xlsx') and not excel_file_name.split('/')[
        -1].startswith('~')


def get_excel_files(dir_name):
    list_of_files = filter(excel_filter, glob.glob(dir_name + '/*'))
    list_of_files = sorted(list_of_files, key=os.path.getmtime)
    return list_of_files


def move_files(base_path, filenames):
    done_folder = base_path + "/done"
    os.makedirs(done_folder, exist_ok=True)
    for file_name in filenames:
        os.system('mv {} {}'.format(file_name, done_folder))


# In[2]:
class LocaleGenerator:

    def __init__(self, language_code, language_name):
        self.language_code = language_code
        self.language_name = language_name
        self.english_column_name = 'English copy'
        self.allowed_values = ['x', 'y', 'z', 'u', 'v', 'w']

    def set_values(self, df_row):
        try:
            if pd.notnull(df_row[self.language_name]) and len(str(df_row[self.language_name]).strip()) != 0:
                df_row['value'] = df_row[self.language_name]
        except:
            print(df_row[self.language_name])
        return df_row

    # In[6]:

    def set_variables(self, df_row):
        for value in self.allowed_values:
            try:
                if pd.notna(df_row[value]):
                    df_row[self.language_name] = df_row[self.language_name].replace('<' + value + '>', df_row[value])
                    df_row[self.english_column_name] = df_row[self.english_column_name].replace('<' + value + '>', df_row[value])
            except:
                pass
        try:
            if pd.notna(df_row['a-tag-replacement']):
                start_index = df_row[self.language_name].find('<a') + 2
                end_index = df_row[self.language_name].find('>')
                df_row[self.language_name] = df_row[self.language_name][:start_index] + df_row['a-tag-replacement'] + \
                                             df_row[self.language_name][end_index:]
                df_row[self.english_column_name] = df_row[self.english_column_name][:start_index] + df_row['a-tag-replacement'] + \
                                                   df_row[self.english_column_name][end_index:]
        except:
            pass

        return df_row

    def clean_read_excel_df(self, df, language_name):
        columns = [self.english_column_name, language_name]
        for value in self.allowed_values:
            if value in df.columns:
                columns.append(value)
        filtered_sheet = df[columns]
        sheet_no_na = filtered_sheet.dropna(subset=[self.english_column_name], inplace=False)
        return sheet_no_na

    # In[12]:

    def clean_excel_df(self, df, language_name):
        excel_df = df.copy()
        for i, row in excel_df.iterrows():
            if pd.notna(row[language_name]):
                row[language_name] = str(row[language_name]).strip()
        excel_df = excel_df.drop_duplicates(subset=['Key', self.english_column_name], keep='last')
        return excel_df

    def read_excels(self, input_base_path):
        path_to_excels = '{}/{}'.format(input_base_path, self.language_code)

        translation_excel_files = get_excel_files(path_to_excels)
        excel_df = read_excels_as_df(translation_excel_files, columns=[self.english_column_name, self.language_name])
        move_files(path_to_excels, translation_excel_files)

        return excel_df

    def process_with_meta_info(self, excel_df, meta_excel_df):
        del meta_excel_df[self.language_name]
        excel_df = self.clean_read_excel_df(excel_df, self.language_name)
        merged_excel_df = pd.merge(excel_df, meta_excel_df, on=self.english_column_name,
                                   how='inner')
        merged_excel_df = merged_excel_df.apply(self.set_variables, axis=1)
        merged_excel_df = self.clean_excel_df(merged_excel_df, self.language_name)
        return merged_excel_df

    # In[18]:

    def get_locale_data(self, input_base_path, input_json_path, meta_excel_df):
        excel_df = self.read_excels(input_base_path)
        existing_locale_json_data = read_json(
            '{input_json_path}/{locale}.json'.format(input_json_path=input_json_path, locale=self.language_code))
        out_df = load_json_as_df(existing_locale_json_data)

        excel_df = self.process_with_meta_info(excel_df, meta_excel_df)

        merged_df = pd.merge(excel_df, out_df, on="Key", how='right')

        merged_df = merged_df.apply(self.set_values, axis=1)

        select_columns = ['Key', 'value']

        filtered_merged_df = merged_df[select_columns]

        final_df = filtered_merged_df.drop_duplicates(subset=['Key'], keep='first', inplace=False)
        return final_df

    def gen_locales(self, input_base_path, input_json_path, meta_input_path, file_type):
        if file_type == 'seperate':
            meta_excel_path = meta_input_path + "/" + self.language_code + ".xlsx"
            meta_excel_df = read_excel_as_df(meta_excel_path, [self.english_column_name, self.language_name])
            final_df = self.get_locale_data(input_base_path, input_json_path, meta_excel_df)
        else:
            meta_excel_path = meta_input_path
            meta_excel_df = read_excel_as_df(meta_excel_path, [self.english_column_name])
            final_df = self.get_locale_data(input_base_path, input_json_path, meta_excel_df)
        return final_df


# ## MAIN CELL TO RUN LOCALE GENERATION

# In[22]:

def main():
    languages_file_name = pkg_resources.resource_filename('resources', resource_name='languages.json')
    languages_to_be_considered = read_json(languages_file_name)

    example = '''
            Example commands:
            
            For specific languages:
                python LocaleGenerator.py -j ./../all_keys_generator/out -e ./input_excel_files -m ./../delta_generation/out-meta -o ./output_json_files -l gu pa
            
            For all languages:
                python LocaleGenerator.py -j ./../all_keys_generator/out -e ./input_excel_files -m ./../delta_generation/out-meta -o ./output_json_files -a
        '''

    parser = argparse.ArgumentParser(epilog=example,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("-a", "--all-languages", action="store_true", help="Generate delta for all languages")
    group.add_argument("-l", "--languages", nargs="+",
                       help="Generate delta for the languages mentioned by language codes(space separated)",
                       choices=list(languages_to_be_considered.keys()))

    parser.add_argument("-e", "--excel-folder-path", required=True, help="Input folder path with excel files present")
    parser.add_argument("-j", "--json-folder-path", required=True, help="Input folder path with json files present")
    parser.add_argument("-m", "--meta-folder-path", required=True,
                        help="Input folder path with meta files for the excels present")
    parser.add_argument("-t", "--type", default='seperate', help="Type of input excel file(s)",
                        choices=['seperate', 'combined'])
    parser.add_argument("--meta-filename", help="Meta file name")
    parser.add_argument("-o", "--output-folder-path", required=True,
                        help="Output folder path where excels are generated")

    args = parser.parse_args(
        "-j /Users/nireshkumarr/Documents/ekstep/crowdsource-dataplatform/utils/localisation_script/delta_generation"
        "/cleaned_jsons -e /Users/nireshkumarr/Documents/ekstep/crowdsource-dataplatform/utils/ofiles/sme-input -m "
        "/Users/nireshkumarr/Documents/ekstep/crowdsource-dataplatform/utils/ofiles/out-meta -o "
        "./output_json_files -l hi".split())

    languages = {}
    if args.all_languages:
        languages = languages_to_be_considered.copy()
    else:
        language_codes = args.languages
        for code in language_codes:
            languages[code] = languages_to_be_considered[code]

    input_base_path = args.excel_folder_path
    input_json_path = args.json_folder_path
    meta_input_path = args.meta_folder_path
    meta_filename = args.meta_filename
    output_base_path = args.output_folder_path

    file_type = args.type

    if file_type == 'combined' and not meta_filename:
        exit()

    if file_type == 'combined' and meta_filename:
        meta_input_path = os.path.join(meta_input_path, meta_filename)

    language_output_map = {}
    for language_code, language_name in languages.items():
        locale_generator = LocaleGenerator(language_code, language_name)
        language_final_df = locale_generator.gen_locales(input_base_path, input_json_path,
                                                         meta_input_path,
                                                         file_type)
        language_output_map[language_code] = language_final_df

    os.makedirs(output_base_path, exist_ok=True)
    for language_code, language_final_df in language_output_map.items():
        output_json_path = '{base_path}/{language}.json'.format(base_path=output_base_path, language=language_code)
        write_df_to_json(language_final_df, output_json_path)


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
