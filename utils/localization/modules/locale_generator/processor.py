import pandas as pd

from modules.locale_generator.data import LocaleOutData
from helper.utils.utils import read_sheet_map_file


class LocaleProcessor:

    def __init__(self, language_name, english_column_name):
        self.language_name = language_name
        self.english_column_name = english_column_name
        self.additional_replacer_list = read_sheet_map_file()

    def add_translation_if_present(self, df_row):
        if self.language_name in list(df_row.index):
            if pd.notnull(df_row[self.language_name]) and len(str(df_row[self.language_name]).strip()) != 0:
                df_row['value'] = df_row[self.language_name]
        return df_row

    def replace_tags_in_df(self, df):
        for i, df_row in df.iterrows():
            if df_row['Key'] in self.additional_replacer_list.keys():
                if 'replacements' in self.additional_replacer_list[df_row['Key']].keys():
                    for from_text, to in self.additional_replacer_list[df_row['Key']]['replacements'].items():
                        if pd.notnull(df_row[self.language_name]) and len(str(df_row[self.language_name]).strip()) != 0:
                            tmp = df_row[self.language_name]
                            df_row[self.language_name] = df_row[self.language_name].replace(from_text, to)
                            df.loc[i, self.language_name] = df_row[self.language_name]
                            if tmp == df_row[self.language_name]:
                                print("In", df_row['Key'], "=> ", from_text, 'is not changed')
                                print("Out", df_row[self.language_name], "=> ", from_text, 'is not changed')
        return df

    def clean_translation_excel(self, df, language_name):
        columns = [self.english_column_name, language_name]
        filtered_sheet = df[columns]
        sheet_no_na = filtered_sheet.dropna(subset=[self.english_column_name], inplace=False)
        for i, row in sheet_no_na.iterrows():
            if pd.notna(row[language_name]):
                row[language_name] = str(row[language_name]).strip()
            if pd.notna(row[self.english_column_name]):
                row[self.english_column_name] = str(row[self.english_column_name]).strip()
        return sheet_no_na

    def clean_meta_df(self, df):
        for i, row in df.iterrows():
            if pd.notna(row[self.english_column_name]):
                row[self.english_column_name] = str(row[self.english_column_name]).strip()
        return df

    def clean_merged_excel(self, df, language_name):
        excel_df = df.copy()
        for i, row in excel_df.iterrows():
            if pd.notna(row[language_name]):
                row[language_name] = str(row[language_name]).strip()
        excel_df = excel_df.drop_duplicates(subset=['Key', self.english_column_name], keep='last')
        return excel_df

    def process_with_meta_info(self, excel_df, meta_excel_df):
        tmp_df = meta_excel_df[['Key', self.language_name]]
        del meta_excel_df[self.language_name]
        excel_df = self.clean_translation_excel(excel_df, self.language_name)
        meta_excel_df = self.clean_meta_df(meta_excel_df)
        merged_excel_df = pd.merge(meta_excel_df, excel_df, on=self.english_column_name,
                                   how='inner')

        merged_excel_df = self.clean_merged_excel(merged_excel_df, self.language_name)
        return merged_excel_df

    def merge_excel_and_json(self, excel_df, json_df):
        merged_df = pd.merge(excel_df, json_df, on="Key", how='right')
        merged_df = merged_df.apply(self.add_translation_if_present, axis=1)
        select_columns = ['Key', 'value']
        filtered_merged_df = merged_df[select_columns]
        final_df = filtered_merged_df.drop_duplicates(subset=['Key'], keep='first', inplace=False)
        return final_df

    def process(self, meta_excel_df, input_excel_df, json_df):
        excel_df = self.process_with_meta_info(input_excel_df, meta_excel_df)
        excel_df = self.replace_tags_in_df(excel_df)

        final_df = self.merge_excel_and_json(excel_df, json_df)

        return LocaleOutData(json_df, excel_df, final_df)
