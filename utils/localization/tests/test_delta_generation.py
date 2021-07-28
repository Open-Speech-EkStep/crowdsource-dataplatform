import os
import unittest
import pandas as pd

from modules.delta_generator.generator import gen_delta
from tests.utils import get_resource_path


def read_excel_as_df(file):
    excel = pd.ExcelFile(file)
    for sheet_name in excel.sheet_names:
        sheet = excel.parse(sheet_name=sheet_name, header=1)
        return sheet


class TestDeltaGenerator(unittest.TestCase):

    def test_fetch_only_non_translated(self):
        languages = {'hi': "Hindi"}
        input_base_path = os.path.join(get_resource_path(), 'delta_dummy_data', 'fetch-only-non-translated')
        meta_out_base_path = input_base_path + "/out-meta"
        sme_out_base_path = input_base_path + "/out-sme"
        ejs_files_base_path = input_base_path + "/ejs_files"
        k = {}
        gen_delta(languages, input_base_path, meta_out_base_path, sme_out_base_path, False, k, ejs_files_base_path,
                  "SEPARATE_SHEETS")

        meta_xl = read_excel_as_df(meta_out_base_path + '/hi.xlsx')
        sme_xl = read_excel_as_df(sme_out_base_path + '/hi.xlsx')

        assert meta_xl["English copy"].count() == 1
        assert list(meta_xl.columns) == ['Key', 'Hindi', 'English copy', 'Url path']
        assert sme_xl["English copy"].count() == 1
        assert list(sme_xl.columns) == ['English copy', 'Hindi', 'Url path']

        assert meta_xl['English copy'][0] == '(No Username)'

        os.system("rm -rf " + meta_out_base_path)
        os.system("rm -rf " + sme_out_base_path)

    def test_success_path(self):
        languages = {'hi': "Hindi"}
        input_base_path = os.path.join(get_resource_path(), 'delta_dummy_data', 'proper-success-case-check')
        meta_out_base_path = input_base_path + "/out-meta"
        sme_out_base_path = input_base_path + "/out-sme"
        ejs_files_base_path = input_base_path + "/ejs_files"

        gen_delta(languages, input_base_path, meta_out_base_path, sme_out_base_path, False, {}, ejs_files_base_path,
                  "SEPARATE_SHEETS")

        meta_xl = read_excel_as_df(meta_out_base_path + '/hi.xlsx')
        sme_xl = read_excel_as_df(sme_out_base_path + '/hi.xlsx')

        assert meta_xl["English copy"].count() == 15
        assert list(meta_xl.columns) == ['Key', 'Hindi', 'English copy', 'Url path', 'a-tag-replacement', 'u', 'v']
        assert sme_xl["English copy"].count() == 14
        assert list(sme_xl.columns) == ['English copy', 'Hindi', 'Url path']

        assert meta_xl['English copy'][2] == '<a>Click Here</a> to go back to home page'
        assert meta_xl['a-tag-replacement'][2] == ' class="" href="/"'

        assert meta_xl['English copy'][3] == 'By proceeding ahead you agree to the <a> Terms and Conditions</a>'
        assert meta_xl['a-tag-replacement'][3] == ' href="../terms-and-conditions.html" target="_blank"'

        assert meta_xl['English copy'][4] == 'By proceeding ahead you agree to the <a> Terms and Conditions</a>'
        assert meta_xl['a-tag-replacement'][4] == ' href="./terms-and-conditions.html" target="_blank"'

        assert meta_xl['English copy'][11] == 'You’ve earned a <u> Bhasha Samarthak Badge by validating <v> Images.'
        assert meta_xl['u'][11] == '<span id="current_badge_name_1"></span>'
        assert meta_xl['v'][11] == '<span id="current_badge_count"></span>'

        assert meta_xl['English copy'][
                   14] == 'Your next goal is to reach <u> images to earn your <v> Bhasha Samarthak Badge.'
        assert meta_xl['u'][14] == '<span id="next_badge_count"></span>'
        assert meta_xl['v'][14] == '<span id="next_badge_name_1"></span>'

        os.system("rm -rf " + meta_out_base_path)
        os.system("rm -rf " + sme_out_base_path)


if __name__ == '__main__':
    unittest.main()
