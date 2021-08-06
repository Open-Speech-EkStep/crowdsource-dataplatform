from modules.locale_generator.excel_input import ExcelInput
from modules.locale_generator.processor import LocaleProcessor
from pandas import notnull


class LocaleGenerator:

    def __init__(self, excel_input: ExcelInput, languages):
        self.languages = languages
        self.excel_input = excel_input
        self.english_column_name = 'English copy'

    def generate(self):
        languages_output_map = {}
        for language_code, language_name in self.languages.items():
            locale_processor = LocaleProcessor(language_name, self.english_column_name)
            columns_to_be_read = [self.english_column_name, language_name]
            meta_excel_df = self.excel_input.read_meta_file(language_code,
                                                            columns=columns_to_be_read)
            input_excel_df = self.excel_input.read_translation_file(language_code, columns=columns_to_be_read)

            if len(input_excel_df) != 0 and len(input_excel_df[notnull(input_excel_df[self.english_column_name])]) == 0:
                raise IndexError(
                    "Required columns not found. Column names must be in row 2 in excel(first row should be empty)")
            json_df = self.excel_input.read_json_file(language_code)

            languages_output_map[language_code] = locale_processor.process(meta_excel_df, input_excel_df, json_df)
        return languages_output_map
