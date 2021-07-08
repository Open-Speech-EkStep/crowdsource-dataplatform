#!/usr/bin/env python
# coding: utf-8

# # Generate local files with the received delta translated excel files

# In[1]:


import pandas as pd
import openpyxl
import json
import os
import re


# In[5]:


def load_json_as_df(json_data):
    out_df = pd.DataFrame(list(json_data.items()),
                       columns=['Key', 'value'])        
    return out_df


# In[10]:


def read_json(json_file_path):
    with open(json_file_path) as f:
        data = json.load(f)
    return data


# In[2]:


def reformat_json(json_obj):
    json_dict = {}
    for key, value in json_obj:
        json_dict[key] = value
    return json_dict


# In[3]:


def set_values(df_row):
    if pd.notnull(df_row[lang]):
        df_row['value'] = df_row[lang]
    return df_row


# In[60]:


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


# In[13]:


def write_df_to_json(df, output_json_path):
    jsonFile = df.to_json(orient='values')
    json_string = json.loads(jsonFile)

    reformatted_json = reformat_json(json_string)

    with open(output_json_path, 'w') as f:
        f.write(json.dumps(reformatted_json, indent = 4, ensure_ascii=False))


# In[15]:


def get_matched_count(excel_df, merged_df):
    count = 0
    for key in excel_df['Key']:
        for k_key in merged_df['Key']:
            if key == k_key:
                count+=1
                break
    return count


# In[7]:


def read_excel_as_df(file, language_name):
    excel = pd.ExcelFile(file)
    for sheet_name in excel.sheet_names:
        sheet = excel.parse(sheet_name = sheet_name, header=0)
        if(len(sheet.columns) == 0):
            continue
        return sheet
    return pd.DataFrame([], columns=[english_col, language_name])


# In[12]:


def clean_json_df(df):
    out_df = df.copy()
    out_df_dropped = out_df.drop_duplicates(subset=['Key'], keep='first')
    return out_df


# In[8]:


def clean_read_excel_df(df, language_name):
    FORMAT = [english_col,language_name]
    for value in allowed_values:
        if value in df.columns:
            FORMAT.append(value)
    filtered_sheet = df[FORMAT]
    sheet_no_na = filtered_sheet.dropna(subset = [english_col, language_name], inplace=False)
    sheet_new = sheet_no_na.rename(columns = {english_col: 'English value'}, inplace=False)
    return sheet_new


# In[11]:


def clean_excel_df(df, language_name):
    excel_df = df.copy()
    try:
        excel_df[language_name] = excel_df[language_name].str.strip()
    except:
        pass
    excel_df = excel_df.drop_duplicates(subset=['English value'], keep='last')
    excel_df[language_name]=excel_df[language_name].apply(lambda x: re.sub(r' -$','',re.sub(r'^X ','',re.sub(r'^x ','',str(x)))))
    return excel_df


# In[6]:


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


# In[62]:


def read_excels(input_base_path, language_code, language_name, meta_excel_df):
    path_to_excel = '{}/{}'.format(input_base_path,language_code)
    excel_files = sorted(os.listdir(path_to_excel))
    translation_excel_files = [path_to_excel+"/"+ excel_file_name for excel_file_name in excel_files if excel_file_name.endswith('.xlsx') and not excel_file_name.startswith('~')]
    excel_df = read_excels_as_df(translation_excel_files, language_code, language_name)
    excel_df = clean_read_excel_df(excel_df, language_name)
    
    merged_excel_df = pd.merge(excel_df, meta_excel_df, left_on="English value", right_on="English copy", how='outer')
    del merged_excel_df["English copy"]

    merged_excel_df = merged_excel_df.apply(set_variables, axis=1)

    return merged_excel_df


# In[48]:


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


# In[23]:


english_col = 'English copy'
allowed_values = ['x','y','z','u','v','w']

def gen_locales(languages, input_base_path, input_json_path, meta_input_path, output_base_path):
    os.makedirs(output_base_path, exist_ok=True)
    for language_code, language_name in languages:
        meta_excel_path = meta_input_path+"/"+language_code+".xlsx"
        meta_excel_df = read_excel_as_df(meta_excel_path,  language_name)
        del meta_excel_df[language_name]

        excelDf_dropped, final_df, merged_df = get_locale_data(input_base_path,input_json_path, language_code, language_name, meta_excel_df)

        print("****** LOCALE = {} **********".format(language_name))
        print("Final Number of Keys(WithoutDuplicates/WithDuplicates) = {}/{}".format(final_df['Key'].nunique(), final_df['Key'].count()))
        print("Matched Keys => {}/{}".format(get_matched_count(excelDf_dropped, merged_df), excelDf_dropped['Key'].count()))
        print("****************")
        output_json_path = '{base_path}/{language}.json'.format(base_path=output_base_path, language=language_code)
        write_df_to_json(final_df, output_json_path)


# ## MAIN CELL TO RUN LOCALE GENERATION

# In[ ]:

if __name__ == '__main__':
    languages = [('hi','Hindi'),('mr','Marathi'),('ta','Tamil'),('or','Odia'),('kn','Kannada'),('te','Telugu')
    ,('gu','Gujarati'), ('bn','Bengali'),('pa','Punjabi'),('as','Assamese'),('ml','Malayalam'),]

    input_base_path = "./input_excel_files"
    input_json_path = './../../../crowdsource-ui/locales'
    meta_input_path = "./../delta_generation/out-meta"
    output_base_path = "./output_json_files"

    gen_locales(languages, input_base_path,input_json_path, meta_input_path, output_base_path)
