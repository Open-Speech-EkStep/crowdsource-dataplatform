#!/usr/bin/env python
# coding: utf-8

# ###### Validation:
# 1. Generate all keys into excel - summary report (Read from code base - ejs files).
# 2. From figma extract keys ( Add / remove keys in excel based on new designs.(for dynamic keys - communicate with UI/UX) - is export from figma possible??? (value updation, new key,value)   )
# 3. Send to meity (Updation, deletion, Addition will be done).
# 4. Read excel from meity and generate json and summary report.
# 5. Update the current html files in case of deletion, addition.
# 6. Keys in other locale files(hi,pa,ta,te) will be automatically updated.
# 
# ###### Translation:
# 7. Translation excel files for other locales will be generated.
# 8. Send to sme's(Update translation).
# 9. Read excel from sme's and generate json and summary report for the respective locales.
# 10. Ingest into the project.
# 

# 1. Can string names from design can be exported in figma?
# 2. Already present keys + new keys that might come up (excel).
# 3. hash in the next phase.

# *** Current Types of keys: ***
# 1. Exact string as keys.
# 2. Keys contain html tags like span, a ,b tags.
# 3. Dynamic key generation ```(eg: ${text} variable which is replaced by string while running gulp and then matched with json) , ${path} variable```
# 4. Static keys. ```(eg: Language: English)```
# 5. special characters in keys. ```(eg: { recordings(s) contributed: '', Transgender - He: '', "(No Username)": "(No Username)",
# 	"*required": "*required" })```
# 6. Mix of uppercased, lowercased, camelcased keys.
# 7. Duplicate Keys differing just by spaces in between.
# 8. Empty keys.
# 9. Unused keys.
# 10. Keys differing by just one word. 
# (
#       Eg: {
#           "Back to Bolo India Home": "Back to Bolo India Home",
#           "Back to Dekho India Home": "Back to Dekho India Home"
#       }
# )

# In[1]:


import pandas as pd
import openpyxl
import json
import re
import os
import pathlib
from ParseHtmlAndGetKeys import get_keys_with_path
import argparse
from datetime import datetime
import json


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


def export_report(report_json, report_type):
    now = datetime.now()
    report_json['last_run_timestamp'] = str(now)
    os.makedirs('reports',exist_ok=True)
    with open('{}/report_{}_{}.json'.format('reports', report_type, now), 'w') as f:
        f.write(json.dumps(report_json, indent = 4, ensure_ascii=False))


# In[10]:


def generate_report():
    report = {}
    total_keys = len(read_json(input_json_path).keys())
    report['total_keys_in_input_json'] = total_keys
    export_report(report, 'excel')


# In[11]:


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
generate_report()

