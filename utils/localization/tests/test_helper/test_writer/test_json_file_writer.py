import json
import os
from unittest import TestCase

from helper.writer.json_file_writer import JsonWriter


class TestJsonWriter(TestCase):
    def setUp(self):
        self.json_file_writer = JsonWriter()

    def test_write(self):
        test_out_path = './../test/test_json_write.json'
        test_json_data = {'Key': 'translation'}
        self.json_file_writer.write(test_out_path, test_json_data)
        self.assertTrue(os.path.isfile(test_out_path))
        with open(test_out_path, 'r') as json_file:
            actual_json_data = json.load(json_file)
        self.assertEqual(actual_json_data, test_json_data)

    def tearDown(self):
        os.remove('./../test/test_json_write.json')
