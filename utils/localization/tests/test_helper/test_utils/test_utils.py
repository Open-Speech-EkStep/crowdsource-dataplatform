import json
import pandas as pd

from unittest import TestCase
from pandas._testing import assert_frame_equal
from helper.utils.utils import load_json_as_df, reformat_json


class TestUtils(TestCase):

    def test_load_json_as_df(self):
        test_json_data = {'text1': 'translation1', 'text2': 'translation2'}
        expected_df = pd.DataFrame([['text1', 'translation1'], ['text2', 'translation2']], columns=['Key', 'value'])
        actual_df = load_json_as_df(test_json_data)

        assert_frame_equal(actual_df, expected_df)

    def test_reformat_json(self):
        df = pd.DataFrame([['a', 'b']], columns=['x', 'y'])
        json_file = df.to_json(orient='values')
        test_json_string = json.loads(json_file)
        actual_result = reformat_json(test_json_string)
        expected_result = {'a': 'b'}
        self.assertEqual(actual_result, expected_result)
