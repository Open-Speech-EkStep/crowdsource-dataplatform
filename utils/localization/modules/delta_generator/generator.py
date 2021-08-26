#!/usr/bin/env python
# coding: utf-8

# # Generate Delta Excel Files using JSON as input.

# In[1]:


import json
import os
import re
from datetime import datetime

import pandas as pd

# In[2]:
from helper.ejs_keys_parser import get_keys_with_path
from helper.utils.utils import extract_and_replace_tags, write_report, extract_and_replace_tags_for_lang


def move_column(dataframe, column_name, index):
    popped_column = dataframe.pop(column_name)
    dataframe.insert(index, column_name, popped_column)


# In[3]:


def read_json(json_file_path):
    with open(json_file_path) as f:
        data = json.load(f)
    return data


# In[4]:


def load_en_key_values(input_base_path):
    language_code = 'en'
    input_json_path = '{base_path}/{language}.json'.format(base_path=input_base_path, language=language_code)
    json_data = read_json(input_json_path)
    return json_data


# In[5]:


def get_dict_for_data(key, processed_text, replacement_mapping_dict, keys_with_path_map):
    out_dict = {"Key": key, "English copy": [processed_text]}
    path = ""
    if key in keys_with_path_map:
        path = keys_with_path_map[key]
    out_dict["Url path"] = [path]
    for replacement in sorted(replacement_mapping_dict.keys()):
        out_dict[replacement] = [replacement_mapping_dict[replacement]]
    return out_dict


# In[6]:


def get_text_from_html_tag(tag):
    text_extraction_regex = r"<(\S*?)[^>]*>(.*?)<\/\1>"
    out_tag = tag
    matches = re.finditer(text_extraction_regex, out_tag, re.MULTILINE)
    string_matches = set()
    for match in matches:
        match_group_length = len(match.groups())
        if match_group_length > 1 and len(match.group(2)) != 0:
            string_matches.add(match.group(2).strip())
    return string_matches


def is_translation_not_present(key, value):
    return key == value and value


def find_keys_without_translation(json_data):
    keys_without_translation = []
    for key, value in json_data.items():
        if is_translation_not_present(key, value):
            keys_without_translation.append(key)
    return keys_without_translation


def get_data_without_translation(json_data, all_keys):
    if all_keys:
        keys_list = list(json_data.keys())
    else:
        keys_list = find_keys_without_translation(json_data)
    return keys_list


def process_tags(allowed_replacements, en_data, keys_list, keys_with_path_map, language_name):
    language_df = pd.DataFrame([], columns=[])
    for key in keys_list:
        en_value = en_data[key]
        processed_text, replacement_mapping_dict = extract_and_replace_tags(en_value, allowed_replacements)
        data_dict = get_dict_for_data(key, processed_text, replacement_mapping_dict, keys_with_path_map)
        try:
            tmp_df = pd.DataFrame.from_dict(data_dict, orient='columns')
            language_df = language_df.append(tmp_df, ignore_index=True)
        except Exception as e:
            print(e, "\n", data_dict, "\n\n")
    language_df[language_name] = ""
    move_column(language_df, language_name, 2)
    return language_df


def process_tags_for_lang(language_df, json_data, language_name, allowed_replacements):
    for i, row in language_df.iterrows():
        key = row['Key']
        columns = list(row.index)
        if not is_translation_not_present(key, json_data[key]):
            replacements = {}
            for replacement in allowed_replacements:
                if replacement in columns:
                    replacements[replacement] = row[replacement]
            out_txt = extract_and_replace_tags_for_lang(json_data[key], replacements)
            row[language_name] = out_txt
    return language_df


def process_delta(languages, input_base_path, all_keys, keys_without_translation,
                  ejs_files_base_path):
    allowed_replacements = ["u", "v", "w", "x", "y", "z"]
    en_data = load_en_key_values(input_base_path)
    keys_with_path_map = get_keys_with_path(ejs_files_base_path)
    language_dfs = {}
    for language_code, language_name in languages.items():
        input_json_path = '{base_path}/{language}.json'.format(base_path=input_base_path, language=language_code)
        json_data = read_json(input_json_path)

        keys_list = get_data_without_translation(json_data, all_keys)
        keys_without_translation[language_name] = keys_list

        language_df = process_tags(allowed_replacements, en_data, keys_list, keys_with_path_map, language_name)
        if all_keys:
            language_df = process_tags_for_lang(language_df, json_data, language_name, allowed_replacements)

        language_dfs[language_code] = language_df
    return language_dfs


def gen_delta(languages, input_base_path, meta_out_base_path, sme_out_base_path, all_keys, keys_without_translation,
              ejs_files_base_path, output_type):
    os.makedirs(meta_out_base_path, exist_ok=True)
    os.makedirs(sme_out_base_path, exist_ok=True)

    language_dfs = process_delta(languages, input_base_path, all_keys,
                                 keys_without_translation,
                                 ejs_files_base_path)
    if output_type == 'SEPARATE_SHEETS':
        for language_code, language_name in languages.items():
            language_df = language_dfs[language_code]
            output_excel_path = '{base_path}/{language}.xlsx'.format(base_path=meta_out_base_path,
                                                                     language=language_code)
            output_sme_excel_path = '{base_path}/{language}.xlsx'.format(base_path=sme_out_base_path,
                                                                         language=language_code)
            cols_to_include_in_sme = ["English copy", language_name, "Url path"]
            export_delta(language_df, cols_to_include_in_sme, output_excel_path, output_sme_excel_path)
    else:
        items = list(languages.items())
        all_df = language_dfs[items[0][0]]
        language_name_list = [items[0][1]]
        for language_code, language_name in items[1:]:
            df = language_dfs[language_code]
            cols_to_include = ['Key', 'English copy', languages[language_code]]
            language_name_list.append(language_name)
            all_df = pd.merge(all_df, df[cols_to_include], how='inner',
                              on=['Key', 'English copy'])
        now = datetime.now()
        output_excel_path = '{base_path}/{timestamp}_meta.xlsx'.format(base_path=meta_out_base_path, timestamp=now)
        output_sme_excel_path = '{base_path}/{timestamp}_sme.xlsx'.format(base_path=sme_out_base_path, timestamp=now)
        cols_to_include_in_sme = ['Key', 'English copy'] + language_name_list
        export_delta(all_df, cols_to_include_in_sme, output_excel_path, output_sme_excel_path)


def export_delta(language_df, cols_to_include_in_sme, output_excel_path, output_sme_excel_path):
    language_df.to_excel(output_excel_path, index=False, startrow=1)
    to_smes = language_df[cols_to_include_in_sme]
    to_smes = to_smes.drop_duplicates(subset=["English copy"], keep="first")
    to_smes.to_excel(output_sme_excel_path, index=False, startrow=1)


def export_report(report_json, report_type):
    now = datetime.now()
    report_json['last_run_timestamp'] = str(now)
    write_report(report_json, report_type)


def generate_report(keys_without_translation):
    report = {'keys_without_translation': keys_without_translation}

    export_report(report, 'delta_generation')
