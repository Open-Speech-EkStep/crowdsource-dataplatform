import pandas as pd
from unittest import TestCase

from pandas._testing import assert_frame_equal

from helper.reader.json_file_reader import JsonReader
from tests.utils import get_resource_path


class TestJsonFileReader(TestCase):
    def setUp(self):
        self.json_reader = JsonReader()

    def test_read(self):
        expected_content = {"name": "name", "json_reader": "json_reader"}

        actual_content = self.json_reader.read(get_resource_path() + "/locale.json")

        self.assertEqual(expected_content, actual_content)

    def test_read_as_df(self):
        expected_content_df = pd.DataFrame([["name", "name"], ['json_reader', 'json_reader']], columns=['Key', 'value'])

        actual_content_df = self.json_reader.read_as_df(get_resource_path() + "/locale.json")

        assert_frame_equal(expected_content_df, actual_content_df)
