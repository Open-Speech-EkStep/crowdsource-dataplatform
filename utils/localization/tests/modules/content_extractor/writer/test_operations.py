import os
from unittest import TestCase
from modules.content_extractor.writer.operations import create_dirs, join_path


class Test(TestCase):
    def test_create_dirs(self):
        test_file_path = 'test/folder1/'
        create_dirs(test_file_path)
        self.assertTrue(os.path.isdir(test_file_path))
        os.remove(test_file_path)

    def test_join_path(self):
        test_file_path = 'test/folder1/'
        test_file_name = 'file.txt'
        path = join_path(test_file_path, test_file_name)
        self.assertEqual(path, 'test/folder1/file.txt')
