import os
from unittest import TestCase
from modules.locale_generator.LocaleProcessor import SingleExcelInput, MultiExcelInput
from unittest.mock import patch


class TestSingleExcelInput(TestCase):
    def setUp(self):
        self.test_input_json_path = './test_input_json_path'
        self.test_input_excel_path = './test_input_excel_path/input.xlsx'
        self.test_meta_input_path = './test_meta_input_path/meta.xlsx'
        self.single_excel_input = SingleExcelInput(self.test_input_json_path, self.test_input_excel_path,
                                                   self.test_meta_input_path)
        self.language_code = 'test'
        self.columns = []

    @patch('test_modules.locale_generator.LocaleProcessor.read_excel_as_df')
    def test_read_meta_file(self, mock_read_excel_as_df):
        self.single_excel_input.read_meta_file(self.language_code, self.columns)
        mock_read_excel_as_df.assert_called_with(self.test_meta_input_path, self.columns)

    @patch('test_modules.locale_generator.LocaleProcessor.read_excel_as_df')
    def test_read_translation_file(self, mock_read_excel_as_df):
        self.single_excel_input.read_translation_file(self.language_code, self.columns)
        mock_read_excel_as_df.assert_called_with(self.test_input_excel_path, self.columns)


class TestMultiExcelInput(TestCase):
    def setUp(self):
        self.test_input_json_path = './test_input_json_path'
        self.test_input_excel_path = './test_input_excel_path'
        self.test_meta_input_path = './test_meta_input_path'
        self.multi_excel_input = MultiExcelInput(self.test_input_json_path, self.test_input_excel_path,
                                                 self.test_meta_input_path)
        self.language_code = 'test'
        self.columns = ['index 1']

    @patch('test_modules.locale_generator.LocaleProcessor.read_excel_as_df')
    def test_read_meta_file(self, mock_read_excel_as_df):
        self.multi_excel_input.read_meta_file(self.language_code, self.columns)
        expected_meta_file_path = os.path.join(self.test_meta_input_path, self.language_code + ".xlsx")
        mock_read_excel_as_df.assert_called_with(expected_meta_file_path, self.columns)

    @patch('test_modules.locale_generator.LocaleProcessor.read_excels_as_df')
    @patch('test_modules.locale_generator.LocaleProcessor.get_excel_files')
    def test_read_translation_file(self, mock_read_excel_files, mock_read_excels_as_df):
        test_translation_excel_files = ['a', 'b']
        mock_read_excel_files.return_value = test_translation_excel_files
        self.multi_excel_input.read_translation_file(self.language_code, columns=self.columns)
        mock_read_excel_files.assert_called_with(self.test_input_excel_path + '/{}'.format(self.language_code))
        mock_read_excels_as_df.assert_called_with(test_translation_excel_files, columns=self.columns)
