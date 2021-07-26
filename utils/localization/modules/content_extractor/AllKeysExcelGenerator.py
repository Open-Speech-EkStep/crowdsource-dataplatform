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
from collections import OrderedDict


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
    return out_txt, replacement_mapping_dict


# In[6]:


def insert_extracted_tags(text, tags, allowed_replacements):
    regex = r"<(\S*?)[^>]*>.*?<\/\1>|<.*?\/>"
    out_txt = text
    matches = re.finditer(regex, out_txt, re.MULTILINE)
    for match in matches:
        matched_tag = match.group()
        if "<b>" in matched_tag:
            continue
        if "<a" in matched_tag:
            attrs = matched_tag[matched_tag.find('<a')+2: matched_tag.find('>')]
            matched_tag_replacement = matched_tag.replace(attrs,"")
            out_txt = out_txt.replace(matched_tag, matched_tag_replacement)
        else:
            for key, value in tags.items():
                if matched_tag == value:
                    out_txt = out_txt.replace(matched_tag, '<{}>'.format(key))
    return out_txt


# In[7]:


def extract_and_replace_tags_for_lang(text, allowed_replacements, replacement_dict):
    tag_identification_regex = r"<(\S*?)[^>]*>.*?<\/\1>|<.*?\/>"
    out_txt = text
    matched_tags = re.finditer(tag_identification_regex, out_txt, re.MULTILINE)
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
            for replacement_tag, match in replacement_dict.items():
                if (matched_tag == match):     
                    replacement = replacement_tag
                    out_txt = out_txt.replace(matched_tag, '<{}>'.format(replacement))
                    break
    return out_txt


# In[8]:


def get_processed_data_for_en(json_data, allowed_replacements, key_path_list):
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


# In[9]:


def get_processed_data_for_lang(en_json_data, json_data, allowed_replacements, key_path_list):    
    language_df = pd.DataFrame([], columns=[])
    for key, value in json_data.items():
        processed_en_text, replacement_mapping_dict = extract_and_replace_tags(en_json_data[key], allowed_replacements)
        processed_lang_text = extract_and_replace_tags_for_lang(value, allowed_replacements, replacement_mapping_dict)
        data_dict = get_dict_for_data(key, processed_lang_text, replacement_mapping_dict, key_path_list)
        try:
            tmp_df = pd.DataFrame.from_dict(data_dict, orient='columns')
            language_df = language_df.append(tmp_df, ignore_index=True)
        except Exception as e:
            print(e, "\n", data_dict, "\n\n")
    return language_df


# In[10]:


def get_path(key, keys_with_path_map):
    for k, path in keys_with_path_map.items():
        if key == k: 
            return path
    return None


# In[11]:


def generate_keys(en_json_path, input_json_path, keys_with_path_map, language_code):
    allowed_replacements = ["u","v","w","x", "y", "z"]
    en_json_data = read_json(en_json_path)
    key_path_list = {key: get_path(key, keys_with_path_map) for key in en_json_data.keys()}
    
    if (language_code =='en'):
        language_df = get_processed_data_for_en(en_json_data, allowed_replacements, key_path_list)
       
    else:
        language_data = read_json(input_json_path)
        language_df = get_processed_data_for_lang(en_json_data, language_data, allowed_replacements, key_path_list)

    return language_df
        


# In[12]:


def replace_non_translations(df_row):
    cols = list(df_row.index)
    cols.remove('Key')
    cols.remove('English copy')
    for col in cols:
        if df_row[col] == df_row['Key']:
            df_row[col] = ""
    return df_row


# In[13]:


def export_report(report_json, report_type, important_dict_keys):
    now = datetime.now()
    report_json['last_run_timestamp'] = str(now)
    all_dict_keys = list(report_json.keys())
    sort_order = important_dict_keys + [k for k in all_dict_keys if k not in important_dict_keys]
    sort_def = lambda item: sort_order.index(item[0])
    report_json = OrderedDict(sorted(report_json.items(), key = sort_def))
    os.makedirs('reports',exist_ok=True)
    json_data = json.dumps(report_json, indent = 4, ensure_ascii=False)
    with open('{}/report_{}_{}.json'.format('reports', report_type, now), 'w') as f:
        f.write(json_data)


# In[14]:


def generate_report(content_keys):
    report = {}
    total_keys = len(content_keys)
    report['total_keys_in_input_json'] = total_keys
    report['content_keys'] = content_keys
    return report


# In[15]:


def generate_output_for_sme(all_df, output_excel_path):
    all_df_copy = all_df.copy()
    allowed_replacements = ['PATH', "u","v","w","x", "y", "z", "a-tag-replacement"]
    for col in allowed_replacements:
        try:
            del all_df_copy[col]
        except Exception as e:
            print(e)
    all_df_copy = all_df_copy.apply(replace_non_translations, axis=1)
    del all_df_copy['Key']
    all_df_copy = all_df_copy.drop_duplicates(subset=['English copy'], keep='first')
    all_df_copy.to_excel(output_excel_path.replace('.xlsx','_sme.xlsx'), index = False, startrow=1)
    return all_df_copy


# In[16]:

def main():
    example = '''
            Example commands:
            
            For only english content:
                python AllKeysExcelGenerator.py -j ./../../../crowdsource-ui/locales -o ./out/en.xlsx --only-en
                
                
            For All language content:
                python AllKeysExcelGenerator.py -j ./../../../crowdsource-ui/locales -o ./out/out.xlsx
        '''

    parser = argparse.ArgumentParser(epilog=example,
                                    formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("-j", "--input-json-path", required=True, help = "Path of json folder with en keys present")
    parser.add_argument("-o","--output-excel-path", required=True, help = "Output path")
    parser.add_argument("--only-en", action="store_true", help = "Include only keys in en.json")

    args = parser.parse_args()

    input_json_path = args.input_json_path
    output_excel_path = args.output_excel_path
    only_en = args.only_en

    if '/' in output_excel_path:
        os.makedirs(output_excel_path[:output_excel_path.rindex("/")], exist_ok=True)

    keys_with_path_map = get_keys_with_path()
    allowed_replacements = ["u","v","w","x", "y", "z"]

    en_json_path = os.path.join(input_json_path,'en.json')

    all_df = generate_keys(en_json_path, en_json_path, keys_with_path_map, 'en')

    overall_report = {}
    overall_report['args'] = vars(args)
    overall_report['English'] = generate_report(list(all_df['Key']))
    important_dict_keys = ['last_run_timestamp', 'args']

    if not only_en:
        languages = read_json('./../languages.json')
        for language_code, language_name in languages.items(): 
            language_json_path = os.path.join(input_json_path,'{}.json'.format(language_code))
            language_df = generate_keys(en_json_path, language_json_path, keys_with_path_map, language_code)
            language_df = language_df.rename(columns={'English copy':language_name})
            language_df = language_df[['Key', language_name]]
            all_df = pd.merge(all_df, language_df, on='Key', how='outer')
            overall_report[language_name] = generate_report(list(language_df['Key']))
        output_excel_path = output_excel_path.replace('.xlsx','_meta.xlsx')
    all_df.to_excel(output_excel_path, index = False, startrow=1)

    if not only_en:
        cleaned_all_df = generate_output_for_sme(all_df, args.output_excel_path)
        overall_report['metrics'] = {'total_actual_content': len(all_df['English copy']), 'total_unique_content': len(cleaned_all_df['English copy'])}
        important_dict_keys.append('metrics')
    export_report(overall_report, 'excel', important_dict_keys)

if __name__=='__main__':
    main()
