from unittest import TestCase
from helper.parser.json_parser import TagParser


class TestTagParser(TestCase):
    def setUp(self):
        self.tag_parser = TagParser(["u", "v", "w", "x", "y", "z"])

    def test_parse_tags_with_single_tag(self):
        test_text = 'test <span id="test"></span> content'
        result_text = self.tag_parser._TagParser__parse_tags(test_text)
        expected_text = 'test <u> content'

        self.assertEqual(result_text, expected_text)

    def test_parse_tags_with_multiple_tag(self):
        test_text = 'test <span id="test"></span> content <span id="test2"></span>'
        result_text = self.tag_parser._TagParser__parse_tags(test_text)
        expected_text = 'test <u> content <v>'

        self.assertEqual(expected_text, result_text)

    def test_parse_tag(self):
        test_text = 'test <span id="test"></span> content'
        matched_tag = '<span id="test"></span>'
        result_text = self.tag_parser._TagParser__parse_tag(matched_tag, test_text)
        expected_text = 'test <u> content'

        self.assertEqual(result_text, expected_text)

    def test_parse_a_tag(self):
        test_text = 'test <a>content</a>'
        matched_tag = '<a>'
        result_text = self.tag_parser._TagParser__parse_a_tag(matched_tag, test_text)
        expected_text = 'test <a>content</a>'

        self.assertEqual(result_text, expected_text)

    def test_parse_a_tag_with_href(self):
        test_text = 'test <a href=\'./../test\'>content</a>'
        matched_tag = '<a href=\'./../test\'>'
        result_text = self.tag_parser._TagParser__parse_a_tag(matched_tag, test_text)
        expected_text = 'test <a>content</a>'

        self.assertEqual(result_text, expected_text)

    # def test_get_dict_for_data(self):
    #     self.fail()
    #
    # def test_parse(self):
    #     self.fail()
