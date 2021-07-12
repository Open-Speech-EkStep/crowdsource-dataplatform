#!/usr/bin/env python
# coding: utf-8

# In[1]:


import pandas as pd
import openpyxl
import json
import os
import re
import argparse


# In[2]:


def load_json_as_df(json_data):
    out_df = pd.DataFrame(list(json_data.items()),
                       columns=[key_column, english_col])        
    return out_df


# In[3]:


def read_json(json_file_path):
    with open(json_file_path) as f:
        data = json.load(f)
    return data


# In[4]:


def reformat_json(json_obj):
    json_dict = {}
    for key, value in json_obj:
        json_dict[key] = value
    return json_dict


# In[5]:


def set_variables(df_row):
    for value in allowed_values:
        try:
            if pd.notna(df_row[value]):
                df_row[english_col] = df_row[english_col].replace('<'+ value + '>', df_row[value])
        except:
            pass
    try:
        if pd.notna(df_row['a-tag-replacement']):
            start_index = df_row[lang].find('<a')+2
            end_index = df_row[lang].find('>')
            df_row[english_col] = df_row[english_col][:start_index] + df_row[english_col] + df_row[english_col][end_index:]
    except:
        pass
        
    return df_row


# In[6]:


def write_df_to_json(df, output_json_path):
    jsonFile = df.to_json(orient='values')
    json_string = json.loads(jsonFile)

    reformatted_json = reformat_json(json_string)

    with open(output_json_path, 'w') as f:
        f.write(json.dumps(reformatted_json, indent = 4, ensure_ascii=False))


# In[7]:


def get_matched_count(excel_df, merged_df):
    count = 0
    for key in excel_df[key_column]:
        for k_key in merged_df[key_column]:
            if key == k_key:
                count+=1
                break
    return count


# In[8]:


def clean_df(df):
    df_no_na = df.dropna(subset = [key_column, english_col], inplace=False)
    df_no_duplicates = df_no_na.drop_duplicates(subset=df.columns, keep='last')
    return df_no_duplicates


# In[9]:


def read_excel_as_df(excel_file):
    excel = pd.ExcelFile(excel_file)
    if len(excel.sheet_names) == 0:
        return None
    sheet = excel.parse(sheet_name = excel.sheet_names[0], header=0)
    return sheet


# In[10]:


key_column = 'Key'
english_col = 'English copy'
allowed_values = ['x','y','z','u','v','w']    

def generate(input_excel_path,input_json_path, output_json_path):    
    excel_df = read_excel_as_df(input_excel_path)
    excel_df = excel_df.apply(set_variables, axis = 1)
    existing_locale_json_data = read_json(input_json_path)
    json_df = load_json_as_df(existing_locale_json_data)

    clean_excel_df = clean_df(excel_df)
    clean_json_df = clean_df(json_df)
    
    merged_df = pd.merge(clean_excel_df, clean_json_df[[key_column]], on=key_column, how='inner')
    
    filtered_df = merged_df[[key_column, english_col]]

    final_df = filtered_df.drop_duplicates(subset=[key_column], keep='first', inplace=False)

    write_df_to_json(final_df, output_json_path)


# In[11]:
if __name__ == '__main__':

    example = '''
            Example commands:

                python AllKeysJsonGenerator.py -j ./../../../crowdsource-ui/locales/en.json -e ./en/out/en.xlsx -o ./en/out/en.json
        '''

    parser = argparse.ArgumentParser(epilog=example,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("-j", "--input-json-path", required=True, help = "Path of json file with en keys present")
    parser.add_argument("-e", "--input-excel-path", required=True, help = "Path of excel file")
    parser.add_argument("-o","--output-json-path", required=True, help = "Output path")


    args = parser.parse_args()

    input_json_path = args.input_json_path
    input_excel_path = args.input_excel_path
    output_json_path = args.output_json_path

    if "/" in output_json_path:
        os.makedirs(output_json_path[:output_json_path.rindex("/")], exist_ok=True)

    generate(input_excel_path,input_json_path, output_json_path)

