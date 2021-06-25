#!/usr/bin/env python
# coding: utf-8

# In[1]:


import pandas as pd
import openpyxl
import json

input_json_file = 'sample/en.json'
out_excel_file = 'sample/en_edited.xlsx'
translation_excel_file = ['sample/sample.xlsx']


# In[2]:


with open(input_json_file) as f:
    js = json.load(f)


# In[3]:


out_df = pd.DataFrame(list(js.items()),
                   columns=['Key', 'To be Translated'])


# In[4]:


lang = 'Hindi'
english_col = 'English copy'
allowed_values = ['x','y','z']


# In[5]:


excelDf = pd.DataFrame([], columns=['Key', lang])
for excel_file_name in translation_excel_file:
    excel = pd.ExcelFile(excel_file_name)
    count = 0
    for sheetName in excel.sheet_names:
        sheet = excel.parse(sheet_name = sheetName, header=1)
        FORMAT = [english_col,lang]
        for value in allowed_values:
            if value in sheet.columns:
                FORMAT.append(value)
        filteredSheet = sheet[FORMAT]
        sheet_no_na = filteredSheet.dropna(subset = [english_col, lang], inplace=False)
        sheet_new = sheet_no_na.rename(columns = {english_col: 'Key'}, inplace=False)
        count += sheet_new.count()
        excelDf = pd.concat([excelDf, sheet_new], axis=0)


# In[6]:


excelDf['Key_lower'] = excelDf['Key'].str.lower()
out_df['Key_lower'] = out_df['Key'].str.lower()


# In[7]:


excelDf_dropped = excelDf.drop_duplicates(subset=['Key_lower'], keep='first')
out_df_dropped = out_df.drop_duplicates(subset=['Key'], keep='first')


# In[8]:


df_diff = pd.merge(out_df_dropped, excelDf_dropped, on="Key_lower",how='left')


# In[9]:


df_diff = df_diff.drop_duplicates(subset=['Key_x'], keep='first')


# In[10]:


df_diff = df_diff[['Key_x', 'To be Translated', lang]]


# In[11]:


df_diff_a = df_diff[df_diff[lang].isna()]


# In[12]:


df_diff[df_diff[lang].isna()].count()


# In[13]:


df_diff_a = df_diff_a.rename(columns = {'Key_x': 'Key'}, inplace=False)


# In[14]:


df_diff_a.to_excel(out_excel_file)


# In[15]:


df_diff_a.count()

