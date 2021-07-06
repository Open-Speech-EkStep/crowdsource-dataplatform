import unittest
from DeltaGenerator import gen_delta
import pandas as pd


def read_excel_as_df(file):
    excel = pd.ExcelFile(file)
    for sheet_name in excel.sheet_names:
        sheet = excel.parse(sheet_name = sheet_name, header=0)
        return sheet


class TestDeltaGeneration(unittest.TestCase):

    def test_fetch_only_non_translated(self):
        languages = [('hi', "Hindi")]
        input_base_path = './../test-data/fetch-only-non-translated'
        meta_out_base_path = input_base_path+ "/out-meta"
        sme_out_base_path = input_base_path+ "/out-sme"

        gen_delta(languages, input_base_path, meta_out_base_path, sme_out_base_path)

        meta_xl = read_excel_as_df(meta_out_base_path+'/hi.xlsx')
        sme_xl = read_excel_as_df(sme_out_base_path+'/hi.xlsx')

        assert meta_xl["English copy"].count() == 1
        assert len(meta_xl.columns) == 4
        assert sme_xl["English copy"].count() == 1
        assert len(sme_xl.columns) == 2


        assert meta_xl['English copy'][0] == '(No Username)'
        

    def test_success_path(self):
        languages = [('hi', "Hindi")]
        input_base_path = './../test-data/proper-success-case-check'
        meta_out_base_path = input_base_path+ "/out-meta"
        sme_out_base_path = input_base_path+ "/out-sme"

        gen_delta(languages, input_base_path, meta_out_base_path, sme_out_base_path)

        meta_xl = read_excel_as_df(meta_out_base_path+'/hi.xlsx')
        sme_xl = read_excel_as_df(sme_out_base_path+'/hi.xlsx')

        assert meta_xl["English copy"].count() == 15
        assert len(meta_xl.columns) == 7
        assert sme_xl["English copy"].count() == 14
        assert len(sme_xl.columns) == 2


        assert meta_xl['English copy'][2] == '<a>Click Here</a> to go back to home page'
        assert meta_xl['a-tag-replacement'][2] == ' class="" href="/"'

        assert meta_xl['English copy'][3] == 'By proceeding ahead you agree to the <a> Terms and Conditions</a>'
        assert meta_xl['a-tag-replacement'][3] == ' href="../terms-and-conditions.html" target="_blank"'

        assert meta_xl['English copy'][4] == 'By proceeding ahead you agree to the <a> Terms and Conditions</a>'
        assert meta_xl['a-tag-replacement'][4] == ' href="./terms-and-conditions.html" target="_blank"'


        assert meta_xl['English copy'][11] == 'You’ve earned a <u> Bhasha Samarthak Badge by validating <v> Images.'
        assert meta_xl['u'][11] == '<span id="current_badge_name_1"></span>'
        assert meta_xl['v'][11] == '<span id="current_badge_count"></span>'


        assert meta_xl['English copy'][14] == 'Your next goal is to reach <u> images to earn your <v> Bhasha Samarthak Badge.'
        assert meta_xl['u'][14] == '<span id="next_badge_count"></span>'
        assert meta_xl['v'][14] == '<span id="next_badge_name_1"></span>'


if __name__ == '__main__':
    unittest.main()