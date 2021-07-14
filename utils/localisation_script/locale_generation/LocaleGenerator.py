#!/usr/bin/env python
# coding: utf-8

# # Generate local files with the received delta translated excel files

# Read file in added data order.

# In[1]:


import pandas as pd
import openpyxl
import json
import os
import re
import glob
import argparse


# In[2]:


def load_json_as_df(json_data):
    out_df = pd.DataFrame(list(json_data.items()),
                       columns=['Key', 'value'])        
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


def set_values(df_row):
    try:
        if pd.notnull(df_row[lang]) and len(str(df_row[lang]).strip()) != 0:
            df_row['value'] = df_row[lang]
    except:
        print(df_row[lang])
    return df_row


# In[6]:


def set_variables(df_row):
    for value in allowed_values:
        try:
            if pd.notna(df_row[value]):
                df_row[lang] = df_row[lang].replace('<'+ value + '>', df_row[value])
                df_row['English value'] = df_row['English value'].replace('<'+ value + '>', df_row[value])
        except:
            pass
    try:
        if pd.notna(df_row['a-tag-replacement']):
            start_index = df_row[lang].find('<a')+2
            end_index = df_row[lang].find('>')
            df_row[lang] = df_row[lang][:start_index] + df_row['a-tag-replacement'] + df_row[lang][end_index:]
            df_row['English value'] = df_row['English value'][:start_index] + df_row['a-tag-replacement'] + df_row['English value'][end_index:]
    except:
        pass
        
    return df_row


# In[7]:


def write_df_to_json(df, output_json_path):
    jsonFile = df.to_json(orient='values')
    json_string = json.loads(jsonFile)

    reformatted_json = reformat_json(json_string)

    with open(output_json_path, 'w') as f:
        f.write(json.dumps(reformatted_json, indent = 4, ensure_ascii=False))


# In[8]:


def get_matched_count(excel_df, merged_df):
    count = 0
    for key in excel_df['Key']:
        for k_key in merged_df['Key']:
            if key == k_key:
                count+=1
                break
    return count


# In[9]:


def read_excel_as_df(file, language_name):
    excel = pd.ExcelFile(file)
    for sheet_name in excel.sheet_names:
        sheet = excel.parse(sheet_name = sheet_name, header=0)
        if(len(sheet.columns) == 0):
            continue
        return sheet
    return pd.DataFrame([], columns=[english_col, language_name])


# In[10]:


def clean_json_df(df):
    out_df = df.copy()
    out_df_dropped = out_df.drop_duplicates(subset=['Key'], keep='first')
    return out_df


# In[11]:


def clean_read_excel_df(df, language_name):
    FORMAT = [english_col,language_name]
    for value in allowed_values:
        if value in df.columns:
            FORMAT.append(value)
    filtered_sheet = df[FORMAT]
    sheet_no_na = filtered_sheet.dropna(subset = [english_col], inplace=False)
    sheet_new = sheet_no_na.rename(columns = {english_col: 'English value'}, inplace=False)
    return sheet_new


# In[12]:


def clean_excel_df(df, language_name):
    excel_df = df.copy()
    try:
        for i, row in excel_df.iterrows():
            if pd.notna(row[language_name]):
                row[language_name] = str(row[language_name]).strip()
    except:
        pass
    excel_df = excel_df.drop_duplicates(subset=['English value'], keep='last')
    return excel_df


# In[13]:


def read_excels_as_df(translation_excel_files, language_code, language_name):
    excel_df = pd.DataFrame([], columns=[english_col, language_name])
    for excel_file_name in translation_excel_files:
        excel = pd.ExcelFile(excel_file_name)
        for sheet_name in excel.sheet_names:
            sheet = excel.parse(sheet_name = sheet_name, header=0)
            if(len(sheet.columns) == 0):
                continue
            excel_df = pd.concat([excel_df, sheet], axis=0)
    return excel_df


# In[14]:


def excel_filter(excel_file_name):
    return os.path.isfile(excel_file_name) and excel_file_name.endswith('.xlsx') and not excel_file_name.split('/')[-1].startswith('~')


# In[15]:


def move_excel_files(path_to_excels, translation_excel_files):
    done_folder = path_to_excels+"/done"
    os.makedirs(done_folder, exist_ok=True)
    for excel_file in translation_excel_files:
        os.system('mv {} {}'.format(excel_file, done_folder))


# In[16]:


def get_excel_files(dir_name):
    list_of_files = filter(excel_filter, glob.glob(dir_name + '/*'))
    list_of_files = sorted(list_of_files, key = os.path.getmtime)
    return list_of_files


# In[17]:


def read_excels(input_base_path, language_code, language_name, meta_excel_df):
    path_to_excels = '{}/{}'.format(input_base_path,language_code)
#     excel_files = sorted(os.listdir(path_to_excel))
    
    translation_excel_files = get_excel_files(path_to_excels)
#     translation_excel_files = [path_to_excel+"/"+ excel_file_name for excel_file_name in excel_files if excel_file_name.endswith('.xlsx') and not excel_file_name.startswith('~')]
    excel_df = read_excels_as_df(translation_excel_files, language_code, language_name)
    move_excel_files(path_to_excels, translation_excel_files)
    
    excel_df = clean_read_excel_df(excel_df, language_name)
    
    merged_excel_df = pd.merge(excel_df, meta_excel_df, left_on="English value", right_on="English copy", how='outer')
    del merged_excel_df[english_col]

    merged_excel_df = merged_excel_df.apply(set_variables, axis=1)

    return merged_excel_df


# In[18]:


def get_locale_data(input_base_path,input_json_path, language_code, language_name, meta_excel_df):
    global lang
    lang = language_name
    
    excel_df = read_excels(input_base_path, language_code, language_name, meta_excel_df)
    existing_locale_json_data = read_json('{input_json_path}/{locale}.json'.format(input_json_path=input_json_path,locale=language_code))
    out_df = load_json_as_df(existing_locale_json_data)

    excelDf_dropped = clean_excel_df(excel_df, language_name)
    out_df_dropped = clean_json_df(out_df)

    merged_df = pd.merge(excelDf_dropped, out_df_dropped, left_on="Key", right_on="Key", how='right')
    
    merged_df = merged_df.apply(set_values, axis = 1)
    
    select_columns = ['Key', 'value']

    filtered_merged_df = merged_df[select_columns]
    
    final_df = filtered_merged_df.drop_duplicates(subset='Key', keep='first', inplace=False)
    return excelDf_dropped, final_df, merged_df


# In[19]:


english_col = 'English copy'
allowed_values = ['x','y','z','u','v','w']

def gen_locales(languages, input_base_path, input_json_path, meta_input_path, output_base_path):
    os.makedirs(output_base_path, exist_ok=True)
    for language_code, language_name in languages:
        meta_excel_path = meta_input_path+"/"+language_code+".xlsx"
        meta_excel_df = read_excel_as_df(meta_excel_path,  language_name)
        del meta_excel_df[language_name]

        excelDf_dropped, final_df, merged_df = get_locale_data(input_base_path,input_json_path, language_code, language_name, meta_excel_df)

        output_json_path = '{base_path}/{language}.json'.format(base_path=output_base_path, language=language_code)
        write_df_to_json(final_df, output_json_path)


# ## MAIN CELL TO RUN LOCALE GENERATION

# In[20]:


LANGUAGES = {'hi': "Hindi",'gu': "Gujarati",'as': "Assamese",'bn':'Bengali','ta':"Tamil",
             'te':"Telugu",'mr':"Marathi",'pa':"Punjabi",'ml':"Malayalam",'or':"Odia",'kn':"Kannada"}

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
group.add_argument("-a", "--all-languages", action="store_true", help = "Generate delta for all languages")
group.add_argument("-l", "--languages", nargs="+", help = "Generate delta for the languages mentioned by language codes(space separated)", choices=list(LANGUAGES.keys()))

parser.add_argument("-e", "--excel-folder-path", required=True, help = "Input folder path with excel files present")
parser.add_argument("-j", "--json-folder-path", required=True, help = "Input folder path with json files present")
parser.add_argument("-m", "--meta-folder-path", required=True, help = "Input folder path with meta files for the excels present")

parser.add_argument("-o", "--output-folder-path", required=True, help = "Output folder path where excels are generated")



args = parser.parse_args()

languages = {}
if args.all_languages:
    languages = LANGUAGES.copy()
else:
    language_codes = args.languages
    for code in language_codes:
        languages[code] = LANGUAGES[code]

input_base_path = args.excel_folder_path
input_json_path = args.json_folder_path
meta_input_path = args.meta_folder_path
output_base_path = args.output_folder_path

gen_locales(languages.items(), input_base_path,input_json_path, meta_input_path, output_base_path)