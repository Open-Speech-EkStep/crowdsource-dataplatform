import pandas as pd

from helper.reader.excel_file_reader import ExcelReader
from modules.locale_generator.data import LocaleOutData
from helper.utils.utils import read_replacer_file


class LocaleProcessor:

    def __init__(self, language_name, english_column_name):
        self.language_name = language_name
        self.english_column_name = english_column_name
        self.allowed_values = ['x', 'y', 'z', 'u', 'v', 'w']
        self.a_tag_replacement = 'a-tag-replacement'
        self.additional_replacer_list = read_replacer_file()

    def add_translation_if_present(self, df_row):
        if self.language_name in list(df_row.index):
            if pd.notnull(df_row[self.language_name]) and len(str(df_row[self.language_name]).strip()) != 0:
                df_row['value'] = df_row[self.language_name]
        return df_row

    def replace_tags_in_df(self, df):
        for i, df_row in df.iterrows():
            for replacer in self.additional_replacer_list:
                if len(replacer['excel_key']) == 0:
                    continue
                if replacer['excel_key'] == df_row['Key']:
                    df_row['Key'] = replacer['json_key']
                    replacements_ = replacer['replacements']
                    for replacer_key in replacements_.keys():
                        if pd.notnull(df_row[self.language_name]) and len(str(df_row[self.language_name]).strip()) != 0:
                            df_row[self.language_name] = df_row[self.language_name].replace(replacer_key,
                                                                                            replacements_[replacer_key])
                    break
        return df

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
        tmp_df = meta_excel_df[['Key', self.language_name]]
        del meta_excel_df[self.language_name]
        excel_df = self.clean_translation_excel(excel_df, self.language_name)
        merged_excel_df = pd.merge(excel_df, meta_excel_df, on=self.english_column_name,
                                   how='inner')
        self.compare_and_update_extracted_tags(tmp_df, merged_excel_df)

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
        excel_df = self.replace_tags_in_df(excel_df)

        final_df = self.merge_excel_and_json(excel_df, json_df)

        return LocaleOutData(json_df, excel_df, final_df)

    def compare_and_update_extracted_tags(self, tmp_df, merged_excel_df):
        count = 0
        excel_reader = ExcelReader()
        new_meta = excel_reader.read_as_df(
            '/Users/nireshkumarr/Documents/ekstep/crowdsource-dataplatform/utils/localization/resources/out_meta_meta'
            '.xlsx',
            [])
        for index, o_row in tmp_df.iterrows():
            n_row = new_meta[new_meta['Key'] == o_row['Key']].iloc[0]
            merged_excel_df_row = merged_excel_df[merged_excel_df['Key'] == o_row['Key']].iloc[0]
            name = self.language_name
            if o_row[name] != n_row[name]:
                # if o_row[name] != merged_excel_df_row[name]:
                #     continue
                # else:
                #     o_row_tmp = o_row[name]
                #     n_row_tmp = n_row[name]
                #     m_row_tmp = merged_excel_df_row[name]
                #
                #     o_row_tmp = o_row_tmp.replace('<u>', '<x>').replace('<v>', '<x>')
                #     n_row_tmp = n_row_tmp.replace('<u>', '<x>').replace('<v>', '<x>')
                #
                #
                #
                # # n_u_index = n_row[name].index("<u>")
                # # n_v_index = n_row[name].index("<u>")
                # # m_u_index = merged_excel_df_row[name].index("<u>")
                # # m_v_index = merged_excel_df_row[name].index("<u>")
                # # count += 1
                print(name, "\n\t", o_row[name], "\n\t", n_row[name], "\n\t", merged_excel_df_row[name] + "\n")
        # print(count)
