#!/usr/bin/env python
# coding: utf-8

# In[1]:


import pandas as pd
import openpyxl
import json


# In[2]:

lang = 'Hindi'
english_col = 'English copy'
allowed_values = ['x','y','z']
input_excel_file = 'sample.xlsx'
input_json_file = 'sample.json'
output_json_file = 'out.json'

excel = pd.ExcelFile(input_excel_file)
excelDf = pd.DataFrame([],
                   columns=['key', lang])
count = 0
for sheetName in excel.sheet_names:
    sheet = excel.parse(sheet_name = sheetName, header=1)
    FORMAT = [english_col,lang]
    for value in allowed_values:
        if value in sheet.columns:
            FORMAT.append(value)
    filteredSheet = sheet[FORMAT]
    sheet_no_na = filteredSheet.dropna(subset = [english_col, lang], inplace=False)
    sheet_new = sheet_no_na.rename(columns = {english_col: 'key'}, inplace=False)
    count += sheet_new.count()
    excelDf = pd.concat([excelDf, sheet_new], axis=0)


# In[3]:



def set_variables(df_row):
    for value in allowed_values:
        try:
            if pd.notna(df_row[value]):
                df_row[lang] = df_row[lang].replace('<'+ value + '>', df_row[value])
                df_row['key'] = df_row['key'].replace('<'+ value + '>', df_row[value])
        except:
            pass
    return df_row



excelDf = excelDf.apply(set_variables, axis=1)


# In[4]:


with open(input_json_file) as f:
    js = json.load(f)
    


# In[5]:


train = pd.DataFrame(list(js.items()),
                   columns=['key', 'value'])


# In[7]:


merged_df = pd.merge(excelDf, train, on="key",how='right')


# In[8]:


def set_values(df_row):
    if not(pd.notnull(df_row[lang])):
        pass
    else:
        df_row['value'] = df_row[lang]
    return df_row

merged_df = merged_df.apply(set_values, axis = 1)


# In[9]:


select_columns = ['key', 'value']

filtered_merged_df = merged_df[select_columns]


# In[10]:


final_df = filtered_merged_df.drop_duplicates(subset='key', keep='first', inplace=False)


# In[11]:


jsonFile = final_df.to_json(orient='values')
jsonFile = json.loads(jsonFile)


# In[12]:


def reformat_json(json_obj):
    json_dict = {}
    for key, value in json_obj:
        json_dict[key] = value
    return json_dict


# In[13]:


final_final_json = reformat_json(jsonFile)


# In[14]:


with open(output_json_file, 'w') as f:
    f.write(json.dumps(final_final_json, indent = 4, ensure_ascii=False))


# In[ ]:




