from unittest import TestCase
from modules.locale_generator.LocaleGenerator import load_json_as_df, reformat_json

import pandas as pd
from pandas._testing import assert_frame_equal


class TestLocaleGenerator(TestCase):

    def test_load_json_as_df(self):
        test_json_data = {'text1': 'translation1', 'text2': 'translation2'}
        expected_df = pd.DataFrame([['text1', 'translation1'], ['text2', 'translation2']], columns=['Key', 'value'])
        actual_df = load_json_as_df(test_json_data)

        assert_frame_equal(actual_df, expected_df)

    def test_reformat_json(self):
        test_json = {'key': 'value'}
        actual_result = reformat_json(test_json.items())
        self.assertEqual(actual_result, test_json)
