from unittest import TestCase
from helper.report.report import LocaleReportGenerator
import pandas as pd
import numpy as np


class TestLocaleGenerationReport(TestCase):
    def test_find_keys_with_translation_needed(self):
        expected = {"maybe": "Maybe"}
        df = pd.DataFrame([{'Key': 'maybe', 'value': 'Maybe'}, {'Key': 'upto10', 'value': '10 वर्ष तक'}],
                          columns=['Key', 'value'])
        en_data = {'maybe': 'Maybe', 'upto10': 'upto 10 years'}
        locale_generation_report = LocaleReportGenerator('Hindi', pd.DataFrame(), df, pd.DataFrame(), en_data)

        translation_needed_content = locale_generation_report.find_translation_needed_content(df)

        self.assertEqual(expected, translation_needed_content)

    def test_convert_excel_df_to_dict(self):
        expected = {
            "upto10": {'English copy': 'upto 10 years', 'Hindi': '10 वर्ष तक'},
            "maybe": {'English copy': 'May be', 'Hindi': np.NAN}
        }
        en_data = {'maybe': 'Maybe', 'upto10': 'upto 10 years'}
        excel_df = pd.DataFrame(
            [
                {'Key': 'maybe', 'English copy': 'May be', 'Hindi': np.NAN},
                {'Key': 'upto10', 'English copy': 'upto 10 years', 'Hindi': '10 वर्ष तक'}
            ],
            columns=['Key', 'English copy', 'Hindi']
        )
        locale_generation_report = LocaleReportGenerator('Hindi', excel_df, pd.DataFrame(), pd.DataFrame(), en_data)

        excel_content = locale_generation_report.convert_excel_df_to_dict()

        self.assertEqual(expected, excel_content)

    def test_find_keys_with_translation_not_needed(self):
        expected = {"upto10": "10 वर्ष तक"}
        json_df = pd.DataFrame([{'Key': 'maybe', 'value': 'Maybe'},
                                {'Key': 'upto10', 'value': '10 वर्ष तक'}],
                               columns=['Key', 'value'])
        en_data = {'maybe': 'Maybe', 'upto10': 'upto 10 years'}
        locale_generation_report = LocaleReportGenerator('Hindi', pd.DataFrame(), json_df, pd.DataFrame(), en_data)

        translation_not_needed_content = locale_generation_report.find_translation_not_needed_content()

        self.assertEqual(expected, translation_not_needed_content)

    def test_find_new_translations_content(self):
        expected = {"maybe": "शायद"}
        json_df = pd.DataFrame([{'Key': 'maybe', 'value': 'Maybe'},
                                {'Key': 'upto10', 'value': '10 वर्ष तक'}],
                               columns=['Key', 'value'])
        en_data = {'maybe': 'Maybe', 'upto10': 'upto 10 years'}
        excel_df = pd.DataFrame(
            [{'Key': 'maybe', 'English copy': 'Maybe', 'Hindi': 'शायद'},
             {'Key': 'upto 10 years', 'English copy': 'upto 10 years', 'Hindi': '10 वर्ष तक'}],
            columns=['Key', 'English copy', 'Hindi'])
        locale_generation_report = LocaleReportGenerator('Hindi', excel_df, json_df, pd.DataFrame(), en_data)

        new_translation_content = locale_generation_report.find_new_translations_content()

        self.assertEqual(expected, new_translation_content)

    def test_find_updated_translations_content(self):
        expected = {"upto10": {"new_value": "10 वर्ष", "old_value": "10 वर्ष तक"}}
        json_df = pd.DataFrame([{'Key': 'maybe', 'value': 'Maybe'},
                                {'Key': 'upto10', 'value': '10 वर्ष तक'}],
                               columns=['Key', 'value'])
        excel_df = pd.DataFrame(
            [{'Key': 'maybe', 'English copy': 'Maybe', 'Hindi': 'शायद'},
             {'Key': 'upto10', 'English copy': 'upto 10 years', 'Hindi': '10 वर्ष'}],
            columns=['Key', 'English copy', 'Hindi'])
        en_data = {'maybe': 'Maybe', 'upto10': 'upto 10 years'}
        locale_generation_report = LocaleReportGenerator('Hindi', excel_df, json_df, pd.DataFrame(), en_data)

        new_translation_content = locale_generation_report.find_updated_translations_content()

        self.assertEqual(expected, new_translation_content)
