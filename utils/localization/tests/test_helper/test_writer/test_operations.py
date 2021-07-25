import os
from unittest import TestCase
from helper.writer.operations import create_dirs


class Test(TestCase):
    def test_create_dirs(self):
        test_file_path = 'test/folder1/'
        create_dirs(test_file_path)
        self.assertTrue(os.path.isdir(test_file_path))
        # os.remove(test_file_path)

    def tearDown(self):
        os.removedirs('./../test/folder1/')
