#!/usr/bin/env python
# coding: utf-8

import json
from collections import OrderedDict
from datetime import datetime

import pandas as pd

from helper.utils.utils import write_report


def move_column(dataframe, column_name, index):
    popped_column = dataframe.pop(column_name)
    dataframe.insert(index, column_name, popped_column)


def read_json(json_file_path):
    with open(json_file_path) as f:
        data = json.load(f)
    return data


def get_dict_for_data(key, processed_text):
    return {"Key": key, "English copy": [processed_text]}


def get_processed_data_for_en(json_data):
    language_df = pd.DataFrame([], columns=[])
    for key, value in json_data.items():
        data_dict = get_dict_for_data(key, value)
        try:
            tmp_df = pd.DataFrame.from_dict(data_dict, orient='columns')
            language_df = language_df.append(tmp_df, ignore_index=True)
        except Exception as e:
            print(e, "\n", data_dict, "\n\n")
    return language_df


def get_processed_data_for_lang(en_json_data, json_data):
    language_df = pd.DataFrame([], columns=[])
    for key, value in json_data.items():
        if key in en_json_data:
            data_dict = get_dict_for_data(key, value)
            try:
                tmp_df = pd.DataFrame.from_dict(data_dict, orient='columns')
                language_df = language_df.append(tmp_df, ignore_index=True)
            except Exception as e:
                print(e, "\n", data_dict, "\n\n")
        else:
            print(key, "not in en json file")
    return language_df


def generate_keys(en_json_path, input_json_path, language_code):
    en_json_data = read_json(en_json_path)

    if language_code == 'en':
        language_df = get_processed_data_for_en(en_json_data)
    else:
        language_data = read_json(input_json_path)
        language_df = get_processed_data_for_lang(en_json_data, language_data)
    return language_df


def replace_non_translations(df_row):
    cols = list(df_row.index)
    cols.remove('Key')
    cols.remove('English copy')
    for col in cols:
        if df_row[col] == df_row['Key']:
            df_row[col] = ""
    return df_row


def export_report(report_json, report_type, important_dict_keys):
    now = datetime.now()
    report_json['last_run_timestamp'] = str(now)
    all_dict_keys = list(report_json.keys())
    sort_order = important_dict_keys + [k for k in all_dict_keys if k not in important_dict_keys]
    sort_def = lambda item: sort_order.index(item[0])
    report_json = OrderedDict(sorted(report_json.items(), key=sort_def))

    write_report(report_json, report_type)


def generate_report(content_keys):
    report = {}
    total_keys = len(content_keys)
    report['total_keys_in_input_json'] = total_keys
    report['content_keys'] = content_keys
    return report


def generate_output_for_sme(all_df, output_excel_path):
    all_df_copy = all_df.copy()
    all_df_copy = all_df_copy.apply(replace_non_translations, axis=1)
    del all_df_copy['Key']
    all_df_copy = all_df_copy.drop_duplicates(subset=['English copy'], keep='first')
    all_df_copy.to_excel(output_excel_path.replace('.xlsx', '_sme.xlsx'), index=False, startrow=1)
    return all_df_copy
