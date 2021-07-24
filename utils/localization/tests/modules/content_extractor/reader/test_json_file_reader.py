from unittest import TestCase
from modules.content_extractor.reader.json_file_reader import JsonReader
from tests.utils import get_resource_path


class TestJsonFileReader(TestCase):

    def test_read_json(self):
        expected_content = {"name": "name", "json_reader": "json_reader"}

        actual_content = JsonReader(get_resource_path() + "/locale.json").read()

        self.assertEqual(expected_content, actual_content)
