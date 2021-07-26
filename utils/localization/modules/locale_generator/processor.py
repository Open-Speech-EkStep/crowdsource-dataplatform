import pandas as pd

from modules.locale_generator.data import LocaleOutData


class LocaleProcessor:

    def __init__(self, language_name, english_column_name):
        self.language_name = language_name
        self.english_column_name = english_column_name
        self.allowed_values = ['x', 'y', 'z', 'u', 'v', 'w']
        self.a_tag_replacement = 'a-tag-replacement'

    def add_translation_if_present(self, df_row):
        if self.language_name in list(df_row.index):
            if pd.notnull(df_row[self.language_name]) and len(str(df_row[self.language_name]).strip()) != 0:
                df_row['value'] = df_row[self.language_name]
        return df_row

    def restructure_extracted_tags(self, df_row):
        column_names = list(df_row.index)
        for value in self.allowed_values:
            if value in column_names and pd.notna(df_row[value]):
                if self.language_name in column_names and pd.notna(df_row[self.language_name]):
                    df_row[self.language_name] = df_row[self.language_name].replace('<' + value + '>',
                                                                                    df_row[value])
                df_row[self.english_column_name] = df_row[self.english_column_name].replace('<' + value + '>',
                                                                                            df_row[value])

        if self.a_tag_replacement in column_names and self.language_name in column_names:
            if pd.notna(df_row[self.a_tag_replacement]):
                start_index = df_row[self.language_name].find('<a') + 2
                end_index = df_row[self.language_name].find('>')

                if self.language_name in column_names and pd.notna(df_row[self.language_name]):
                    df_row[self.language_name] = df_row[self.language_name][:start_index] + df_row[
                        self.a_tag_replacement] + \
                                                 df_row[self.language_name][end_index:]

                df_row[self.english_column_name] = df_row[self.english_column_name][:start_index] + df_row[
                    self.a_tag_replacement] + df_row[self.english_column_name][end_index:]

        return df_row

    def clean_translation_excel(self, df, language_name):
        columns = [self.english_column_name, language_name]
        for value in self.allowed_values:
            if value in df.columns:
                columns.append(value)
        filtered_sheet = df[columns]
        sheet_no_na = filtered_sheet.dropna(subset=[self.english_column_name], inplace=False)
        return sheet_no_na

    def clean_merged_excel(self, df, language_name):
        excel_df = df.copy()
        for i, row in excel_df.iterrows():
            if pd.notna(row[language_name]):
                row[language_name] = str(row[language_name]).strip()
        excel_df = excel_df.drop_duplicates(subset=['Key', self.english_column_name], keep='last')
        return excel_df

    def process_with_meta_info(self, excel_df, meta_excel_df):
        del meta_excel_df[self.language_name]
        excel_df = self.clean_translation_excel(excel_df, self.language_name)
        merged_excel_df = pd.merge(excel_df, meta_excel_df, on=self.english_column_name,
                                   how='inner')
        merged_excel_df = merged_excel_df.apply(self.restructure_extracted_tags, axis=1)
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

        final_df = self.merge_excel_and_json(excel_df, json_df)

        return LocaleOutData(json_df, excel_df, final_df)


