import pandas as pd
import openpyxl
import json
import re
import os
import pathlib
from ParseHtmlAndGetKeys import get_keys_with_path
import argparse


# In[2]:


def move_column(dataframe, column_name, index):
    popped_column = dataframe.pop(column_name)
    dataframe.insert(index, column_name, popped_column)


# In[3]:


def read_json(json_file_path):
    with open(json_file_path) as f:
        data = json.load(f)
    return data


# In[4]:


def get_dict_for_data(key, processed_text, replacement_mapping_dict, key_path_list):
    out_dict = {}
    out_dict["Key"] = key
    out_dict["English copy"] = [processed_text]
    out_dict["PATH"] = [key_path_list[key]]
    for replacement in sorted (replacement_mapping_dict.keys()):
        out_dict[replacement] = [replacement_mapping_dict[replacement]]
    return out_dict


# In[5]:


def extract_and_replace_tags(text, allowed_replacements):
    tag_identification_regex = r"<(\S*?)[^>]*>.*?<\/\1>|<.*?\/>"
    out_txt = text
    matched_tags = re.finditer(tag_identification_regex, out_txt, re.MULTILINE)
    replacement_identifier_index = 0
    replacement_mapping_dict = {}
    for match in matched_tags:
        matched_tag = match.group()
        if "<b>" in matched_tag:
            continue
        elif "<a" in matched_tag:
            attributes_part_string = matched_tag[matched_tag.find('<a')+2: matched_tag.find('>')]
            replacement_mapping_dict['a-tag-replacement'] = attributes_part_string
            matched_tag_replacement = matched_tag.replace(attributes_part_string,"")
            out_txt = out_txt.replace(matched_tag, matched_tag_replacement)
        else:
            replacement = allowed_replacements[replacement_identifier_index]
            replacement_mapping_dict[replacement] = matched_tag
            replacement_identifier_index+=1
            out_txt = out_txt.replace(matched_tag, '<{}>'.format(replacement))
    return out_txt , replacement_mapping_dict


# In[6]:


def get_processed_data(json_data, allowed_replacements, key_path_list):
    language_df = pd.DataFrame([], columns=[])
    for key, value in json_data.items():
        processed_text, replacement_mapping_dict = extract_and_replace_tags(value, allowed_replacements)
        data_dict = get_dict_for_data(key, processed_text, replacement_mapping_dict, key_path_list)
        try:
            tmp_df = pd.DataFrame.from_dict(data_dict, orient='columns')
            language_df = language_df.append(tmp_df, ignore_index=True)
        except Exception as e:
            print(e, "\n", data_dict, "\n\n")
    return language_df


# In[7]:


def get_path(key, keys_with_path_map):
    for k, path in keys_with_path_map.items():
        if key == k: 
            return path
    return None


# In[8]:


def generate_keys(input_json_path, output_excel_path, keys_with_path_map):

    allowed_replacements = ["u","v","w","x", "y", "z"]
    en_data = read_json(input_json_path)
    language_code = 'en'
    key_path_list = {key: get_path(key, keys_with_path_map) for key in en_data.keys()}


    language_df = get_processed_data(en_data, allowed_replacements, key_path_list)

    language_df.to_excel(output_excel_path, index = False)


# In[9]:
if __name__ == '__main__':

    example = '''
            Example commands:

            python AllKeysExcelGenerator.py -j ./../../../crowdsource-ui/locales/en.json -o ./en/out/en.xlsx
        '''

    parser = argparse.ArgumentParser(epilog=example,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("-j", "--input-json-path", required=True, help = "Path of json file with en keys present")
    parser.add_argument("-o","--output-excel-path", required=True, help = "Output path")


    args = parser.parse_args()

    input_json_path = args.input_json_path
    output_excel_path = args.output_excel_path

    if '/' in output_excel_path:
        os.makedirs(output_excel_path[:output_excel_path.rindex("/")], exist_ok=True)

    keys_with_path_map = get_keys_with_path()
    generate_keys(input_json_path, output_excel_path, keys_with_path_map)

