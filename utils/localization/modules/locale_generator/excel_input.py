from helper.reader.excel_file_reader import ExcelReader
from helper.reader.json_file_reader import JsonReader
from helper.utils.utils import get_excel_files
from modules.locale_generator.utils import get_excel_files
from abc import ABC, abstractmethod
import os


class ExcelInput(ABC):

    def __init__(self, input_json_path, meta_input_path):
        self.input_json_path = input_json_path
        self.meta_input_path = meta_input_path
        self.json_reader = JsonReader()
        self.excel_reader = ExcelReader()

    @abstractmethod
    def read_translation_file(self, language_code, columns):
        pass

    @abstractmethod
    def read_meta_file(self, language_code, columns):
        pass

    def read_json_file(self, language_code):
        json_path = '{input_json_path}/{locale}.json'.format(input_json_path=self.input_json_path, locale=language_code)
        return self.json_reader.read_as_df(json_path)


class SingleExcelInput(ExcelInput):

    def __init__(self, input_json_path, input_excel_path, meta_input_path):
        super().__init__(input_json_path, meta_input_path)
        self.input_json_path = input_json_path
        # file path
        self.input_excel_path = input_excel_path
        # file path
        self.meta_input_path = meta_input_path

    def read_meta_file(self, language_code, columns):
        return self.excel_reader.read_as_df(self.meta_input_path, columns)

    def read_translation_file(self, language_code, columns):
        return self.excel_reader.read_as_df(self.input_excel_path, columns)


class MultiExcelInput(ExcelInput):

    def __init__(self, input_json_path, input_base_path, meta_input_path):
        super().__init__(input_json_path, meta_input_path)
        self.input_json_path = input_json_path
        # folder path
        self.input_base_path = input_base_path
        # file path
        self.meta_input_path = meta_input_path

    def read_meta_file(self, language_code, columns):
        return self.excel_reader.read_as_df(os.path.join(self.meta_input_path, language_code + ".xlsx"), columns)

    def read_translation_file(self, language_code, columns=None):
        if columns is None:
            columns = []
        path_to_excels = os.path.join(self.input_base_path, language_code)
        translation_excel_files = get_excel_files(path_to_excels)
        excel_df = self.excel_reader.read_files(translation_excel_files, columns=columns)
        return excel_df
