#!/usr/bin/env python
import json
import os
from datetime import datetime

import pandas as pd

from helper.utils.utils import write_report


def load_json_as_df(json_data):
    out_df = pd.DataFrame(list(json_data.items()),
                          columns=[key_column, english_col])
    return out_df


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


def get_matched_count(excel_df, merged_df):
    count = 0
    for key in excel_df[key_column]:
        for k_key in merged_df[key_column]:
            if key == k_key:
                count += 1
                break
    return count


def clean_df(df):
    df_no_na = df.dropna(subset=[key_column], inplace=False)
    df_fill_na = df.fillna(value="")
    df_no_duplicates = df_fill_na.drop_duplicates(subset=[key_column], keep='last')
    return df_no_duplicates


def read_excel_as_df(excel_file):
    excel = pd.ExcelFile(excel_file)
    if len(excel.sheet_names) == 0:
        return None
    sheet = excel.parse(sheet_name=excel.sheet_names[0], header=1)
    return sheet


def read_excels_as_df(file):
    excel = pd.ExcelFile(file)
    sheets_df_list = []
    for sheet_name in excel.sheet_names:
        sheet = excel.parse(sheet_name=sheet_name, header=1)
        if len(sheet.columns) == 0:
            continue
        sheet = sheet.dropna(how='all')
        sheet = sheet.dropna(axis=1, how='all')
        sheets_df_list.append(sheet)
    return sheets_df_list


def read_manually_generated_excel_file(excel_file):
    sheet_df_list = read_excels_as_df(excel_file)
    main_columns = ['TTS Initiative', 'translation Initiative', 'ASR Initiative', 'OCR Initiative', 'English Content']

    final_df = pd.DataFrame([], columns=[key_column, english_col])

    for sheet_df in sheet_df_list:
        columns = [column_name.rstrip().lstrip() for column_name in list(sheet_df.columns)]
        for main_column in main_columns:
            if main_column in columns:
                try:
                    filtered_sheet = sheet_df[[main_column + " Key", main_column]]
                except Exception as e:
                    continue
                renamed_df = filtered_sheet.rename(columns={main_column + " Key": key_column, main_column: english_col})
                renamed_df = renamed_df.dropna(subset=[key_column])
                final_df = pd.concat([final_df, renamed_df], ignore_index=True)
    return final_df


def clean_old_translations(modified_content_keys, added_content_keys, languages, base_path, output_path):
    for language_code in languages.keys():
        input_json_path = os.path.join(base_path, '{language_code}/common.json'.format(language_code=language_code))
        language_data = read_json(input_json_path)
        output_json_path = os.path.join(output_path, '{language_code}/common.json'.format(language_code=language_code))
        os.makedirs(os.path.join(output_path, '{language_code}'.format(language_code=language_code)), exist_ok=True)
        for key in modified_content_keys:
            language_data[key] = ""
        for key in added_content_keys:
            language_data[key] = ""
        with open(output_json_path, 'w') as f:
            f.write(json.dumps(language_data, indent=4, ensure_ascii=False))


def get_modified_content(excel_df, json_df):
    json_file = json_df.to_json(orient='values')
    json_string = json.loads(json_file)

    reformatted_json = reformat_json(json_string)

    changed_content = {}
    for i, row in excel_df.iterrows():
        key = row[key_column]
        if key in reformatted_json and (row[english_col].lower() != reformatted_json[key].lower()):
            changed_content[key] = {'old': reformatted_json[key], 'new': row[english_col]}
    return changed_content


def get_keys_by_action(excel_df, json_df, action):
    s = set(json_df[key_column])
    f = set(excel_df[key_column])
    if action == 'removal':
        difference = list(s - f)
    elif action == 'addition':
        difference = list(f - s)
    else:
        raise ValueError("Invalid action taken as input")
    return difference


def export_report(report_json, report_type):
    now = datetime.now()
    report_json['last_run_timestamp'] = str(now)
    write_report(report_json, report_type)


def generate_report(json_df, excel_df, modified_content_keys):
    report = {}
    removed_keys = get_keys_by_action(excel_df, json_df, 'removal')
    newly_added_keys = get_keys_by_action(excel_df, json_df, 'addition')
    report['total_keys_in_json'] = int(json_df[key_column].count())
    report['total_keys_received_in_excel'] = int(excel_df[key_column].count())
    report['total_content_newly_added'] = len(newly_added_keys)
    report['total_content_updated'] = len(modified_content_keys)
    report['total_content_removed'] = len(removed_keys)
    report['removed_keys'] = removed_keys
    report['updated_content'] = modified_content_keys
    report['newly_added_content'] = newly_added_keys
    export_report(report, 'all_keys_json_generation')


def set_values(df_row):
    df_row_x = df_row[english_col + '_x']
    df_row_y = df_row[english_col + '_y']
    if pd.notnull(df_row_x) and len(str(df_row_x).strip()) != 0:
        df_row[english_col] = df_row_x
    elif pd.notnull(df_row_y) and len(str(df_row_y).strip()) != 0:
        df_row[english_col] = df_row_y
    else:
        df_row[english_col] = ""

    return df_row


key_column = 'Key'
english_col = 'English copy'


def generate(input_excel_path, input_json_path, output_json_path, input_category):
    if input_category == 'auto-generated':
        excel_df = read_excel_as_df(input_excel_path)
    else:
        excel_df = read_manually_generated_excel_file(input_excel_path)
    existing_locale_json_data = read_json(input_json_path)
    json_df = load_json_as_df(existing_locale_json_data)

    clean_excel_df = clean_df(excel_df)
    clean_json_df = clean_df(json_df)

    merged_df = pd.merge(clean_excel_df, clean_json_df, on=key_column, how='outer')
    merged_df = merged_df.apply(set_values, axis=1)

    filtered_df = merged_df[[key_column, english_col]]

    final_df = filtered_df.drop_duplicates(subset=[key_column], keep='first', inplace=False)

    os.makedirs(os.path.join(output_json_path, 'en'), exist_ok=True)
    write_df_to_json(final_df, os.path.join(output_json_path, 'en/common.json'))

    return clean_excel_df, clean_json_df
