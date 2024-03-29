import glob
import json
import os
import re
from datetime import datetime

import pandas as pd
import pkg_resources

from helper.writer.json_file_writer import JsonWriter
from modules.locale_generator.utils import read_json


def reformat_json(json_obj):
    json_dict = {}
    for key, value in json_obj:
        json_dict[key] = value
    return json_dict


def write_df_to_json(df, output_json_path):
    json_file = df.to_json(orient='values')
    json_string = json.loads(json_file)

    reformatted_json = reformat_json(json_string)

    JsonWriter().write(output_json_path, reformatted_json)


def load_json_as_df(json_data, columns=None):
    if columns is None:
        columns = ['Key', 'value']
    out_df = pd.DataFrame(list(json_data.items()),
                          columns=columns)
    return out_df


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


# unused
def read_excel_as_df(filename, columns: list):
    excel_df = pd.DataFrame([], columns=columns)
    excel = pd.ExcelFile(filename)
    for sheet_name in excel.sheet_names:
        sheet = excel.parse(sheet_name=sheet_name, header=1)
        if len(sheet.columns) == 0:
            continue
        excel_df = pd.concat([excel_df, sheet], axis=0)
    return excel_df


# unused
def read_excels_as_df(filenames, columns: list):
    excel_df = pd.DataFrame([], columns=columns)
    for excel_file_name in filenames:
        excel_file_df = read_excel_as_df(excel_file_name, columns)
        excel_df = pd.concat([excel_df, excel_file_df], axis=0)
    return excel_df


# unused
def get_matched_count(excel_df, merged_df):
    count = 0
    for key in excel_df['Key']:
        for k_key in merged_df['Key']:
            if key == k_key:
                count += 1
                break
    return count


def get_root_folder():
    return os.path.join(os.path.dirname(__file__), '../..')


def write_report(report, report_type):
    now = datetime.now()
    report_folder = os.path.join(get_root_folder(), 'reports')
    os.makedirs(report_folder, exist_ok=True)
    JsonWriter().write(
        '{folder_name}/{timestamp}_{report_type}_report.json'.format(
            folder_name=report_folder,
            report_type=report_type,
            timestamp=now
        ), report)


def read_language_list():
    languages_file_name = pkg_resources.resource_filename('resources', resource_name='languages.json')
    languages_to_be_considered = read_json(languages_file_name)
    return languages_to_be_considered


def get_selected_languages(languages_to_be_considered, select_all_flag, selected_languages: list):
    languages = {}
    if select_all_flag:
        languages = languages_to_be_considered.copy()
    else:
        language_codes = selected_languages
        for code in language_codes:
            languages[code] = languages_to_be_considered[code]

    return languages


def read_sheet_map_file():
    map_file = pkg_resources.resource_filename('resources', resource_name='sheet_mapping.json')
    maps = read_json(map_file)
    return maps
