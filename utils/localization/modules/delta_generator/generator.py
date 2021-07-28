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
from helper.utils.utils import extract_and_replace_tags, write_report


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
    out_dict = {}
    out_dict["Key"] = key
    out_dict["English copy"] = [processed_text]
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


def get_data_without_translation(language_name, json_data, allowed_replacements, en_data, all_keys, keys_with_path_map,
                                 keys_without_translation):
    language_df = pd.DataFrame([], columns=[])
    if all_keys:
        keys_list = list(json_data.keys())
    else:
        keys_list = find_keys_without_translation(json_data)
        keys_without_translation[language_name] = keys_list

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
    move_column(language_df, language_name, 1)
    return language_df


# In[9]:


def find_keys_without_translation(json_data):
    keys_without_translation = []
    for key, value in json_data.items():
        if key == value and value:
            keys_without_translation.append(key)
    return keys_without_translation


# In[10]:


def gen_delta(languages, input_base_path, meta_out_base_path, sme_out_base_path, all_keys, keys_without_translation,
              ejs_files_base_path):
    os.makedirs(meta_out_base_path, exist_ok=True)
    os.makedirs(sme_out_base_path, exist_ok=True)

    allowed_replacements = ["u", "v", "w", "x", "y", "z"]
    en_data = load_en_key_values(input_base_path)
    keys_with_path_map = get_keys_with_path(ejs_files_base_path)

    for language_code, language_name in languages:
        input_json_path = '{base_path}/{language}.json'.format(base_path=input_base_path, language=language_code)
        json_data = read_json(input_json_path)

        language_df = get_data_without_translation(language_name, json_data, allowed_replacements, en_data, all_keys,
                                                   keys_with_path_map, keys_without_translation)

        output_excel_path = '{base_path}/{language}.xlsx'.format(base_path=meta_out_base_path, language=language_code)
        language_df.to_excel(output_excel_path, index=False, startrow=1)
        output_sme_excel_path = '{base_path}/{language}.xlsx'.format(base_path=sme_out_base_path,
                                                                     language=language_code)
        to_smes = language_df[["English copy", language_name, "Url path"]]
        to_smes = to_smes.drop_duplicates(subset=["English copy"], keep="first")
        to_smes.to_excel(output_sme_excel_path, index=False, startrow=1)


# In[11]:


def export_report(report_json, report_type):
    now = datetime.now()
    report_json['last_run_timestamp'] = str(now)
    write_report(report_json, report_type)


# In[12]:


def generate_report(keys_without_translation):
    report = {'keys_without_translation': keys_without_translation}

    export_report(report, 'delta_generation')