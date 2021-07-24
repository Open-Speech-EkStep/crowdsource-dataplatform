from unittest import TestCase
from helper.reader.json_file_reader import JsonReader
from tests.utils import get_resource_path


class TestJsonFileReader(TestCase):

    def test_read_json(self):
        expected_content = {"name": "name", "json_reader": "json_reader"}

        actual_content = JsonReader('').read(get_resource_path() + "/locale.json")

        self.assertEqual(expected_content, actual_content)
