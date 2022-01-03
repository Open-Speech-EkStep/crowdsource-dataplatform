import re

import pandas as pd


class LocaleReportGenerator:

    def __init__(self, language_name, excel_df: pd.DataFrame, json_df: pd.DataFrame, final_df: pd.DataFrame, en_data):
        self.language = language_name
        self.final_df = final_df
        self.json_df = json_df
        self.excel_df = excel_df
        self.en_data = en_data

    def convert_excel_df_to_dict(self):
        content_dict = {}
        for _, row in self.excel_df.iterrows():
            content_dict[row['Key']] = {self.language: row[self.language], 'English copy': row['English copy']}
        return content_dict

    def find_translation_needed_content(self, df):
        translation_needed_content = {}
        for _, row in df.iterrows():
            key = row['Key']
            value = row['value']
            if self.en_data[key] == value or value == "":
                translation_needed_content[key] = value
        return translation_needed_content

    def find_translation_not_needed_content(self):
        translation_needed_content = {}
        for _, row in self.json_df.iterrows():
            key = row['Key']
            value = row['value']
            if self.en_data[key] != value:
                translation_needed_content[key] = value
        return translation_needed_content

    def find_new_translations_content(self):
        new_translation_content = {}
        translation_needed_content = self.find_translation_needed_content(self.json_df)
        excel_content = self.convert_excel_df_to_dict()
        for key, value in translation_needed_content.items():
            if key in excel_content.keys():
                excel_content_value = excel_content[key][self.language]
                if value != excel_content_value and pd.notnull(excel_content_value) and len(
                        excel_content_value.strip()) != 0:
                    new_translation_content[key] = excel_content_value
        return new_translation_content

    def find_updated_translations_content(self):
        updated_translation_content = {}
        excel_content = self.convert_excel_df_to_dict()
        for key, value in self.find_translation_not_needed_content().items():
            if key in excel_content.keys():
                excel_content_value = excel_content[key][self.language]
                if pd.notnull(excel_content_value) and len(excel_content_value.strip()) != 0 and value != excel_content_value:
                    updated_translation_content[key] = {"old_value": value, "new_value": excel_content_value}

        return updated_translation_content

    @staticmethod
    def find_content_not_present(keys_to_find_in, keys_to_be_found):
        keys_not_present = []
        for json_key in keys_to_be_found:
            if json_key not in keys_to_find_in:
                keys_not_present.append(json_key)
        return keys_not_present

    @staticmethod
    def find_remaining_needed_in_json(translation_remaining_keys, keys_missing_in_excel):
        keys = []
        for key in translation_remaining_keys:
            if key in keys_missing_in_excel:
                keys.append(key)
        return keys

    def generate_report(self):
        # total_keys in sent json
        # total_keys from sme
        # total_keys in newly generated locale
        # total_new translations needed by language
        # total_keys translation added by language
        # total_keys translation updated by language
        # total_keys remaining translations by language
        # translation added by language
        # translation updated by language
        # remaining translations by language

        translation_needed_content = self.find_translation_needed_content(self.json_df)
        translation_needed_keys = translation_needed_content.keys()

        new_translations_content = self.find_new_translations_content()
        new_translations_content_keys = new_translations_content.keys()

        updated_translations_content = self.find_updated_translations_content()
        # updated_translations_content_keys = updated_translations_content.keys()

        translation_remaining_content = self.find_translation_needed_content(self.final_df)
        translation_remaining_keys = translation_remaining_content.keys()

        excel_df_keys = list(self.excel_df['Key'])
        json_df_keys = list(self.json_df['Key'])

        keys_missing_in_excel = self.find_content_not_present(excel_df_keys, json_df_keys)

        remaining_needed_and_not_in_delta = self.find_remaining_needed_in_json(translation_remaining_keys,
                                                                               keys_missing_in_excel)

        keys_missing_in_json = self.find_content_not_present(json_df_keys, excel_df_keys)

        return {
            'total_keys_translation_needed': len(translation_needed_keys),
            'total_keys_in_existing_locale_json': len(self.json_df['Key']),
            'total_keys_in_translation_excel': len(self.excel_df['Key']),
            'total_keys_in_newly_created_locale': len(self.final_df['Key']),
            'total_keys_translation_added': len(new_translations_content_keys),
            'total_keys_translation_updated': len(updated_translations_content),
            'total_keys_translation_remaining': len(translation_remaining_keys),
            'total_remaining_needed_and_not_in_delta': len(remaining_needed_and_not_in_delta),
            'keys_translation_needed': list(translation_needed_keys),
            'keys_translations_added': list(new_translations_content_keys),
            'translations_updated': updated_translations_content,
            'keys_translations_remaining': list(translation_remaining_keys),
            'keys_missing_in_excel': keys_missing_in_excel,
            'keys_missing_in_json': keys_missing_in_json,
            'remaining_needed_and_not_in_delta': remaining_needed_and_not_in_delta
        }
