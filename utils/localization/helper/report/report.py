import pandas as pd


class LocaleReportGenerator:

    def __init__(self, language_name, excel_df: pd.DataFrame, json_df: pd.DataFrame, final_df: pd.DataFrame):
        self.language = language_name
        self.final_df = final_df
        self.json_df = json_df
        self.excel_df = excel_df

    def convert_excel_df_to_dict(self):
        content_dict = {}
        for _, row in self.excel_df.iterrows():
            content_dict[row['Key']] = {self.language: row[self.language], 'English copy': row['English copy']}
        return content_dict

    @staticmethod
    def find_translation_needed_content(df):
        translation_needed_content = {}
        for _, row in df.iterrows():
            key = row['Key']
            value = row['value']
            if key == value:
                translation_needed_content[key] = value
        return translation_needed_content

    def find_translation_not_needed_content(self):
        translation_needed_content = {}
        for _, row in self.json_df.iterrows():
            key = row['Key']
            value = row['value']
            if key != value:
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
                excel_content_english_copy = excel_content[key]['English copy']
                if pd.notnull(excel_content_value) and len(
                        excel_content_value.strip()) != 0 and value != excel_content_value and value != excel_content_english_copy:
                    updated_translation_content[key] = excel_content_value

        return updated_translation_content

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
        updated_translations_content_keys = updated_translations_content.keys()

        translation_remaining_content = self.find_translation_needed_content(self.final_df)
        translation_remaining_keys = translation_remaining_content.keys()

        return {
            'total_keys_translation_needed': len(translation_needed_keys),
            'total_keys_in_existing_locale_json': len(self.json_df['Key']),
            'total_keys_in_translation_excel': len(self.excel_df['Key']),
            'total_keys_in_newly_created_locale': len(self.final_df['Key']),
            'total_keys_translation_added': len(new_translations_content_keys),
            'total_keys_translation_updated': len(updated_translations_content_keys),
            'total_keys_translation_remaining': len(translation_remaining_keys),
            'keys_translation_needed': list(translation_needed_keys),
            'keys_translations_added': list(new_translations_content_keys),
            'keys_translations_updated': list(updated_translations_content),
            'keys_translations_remaining': list(translation_remaining_keys)
        }
