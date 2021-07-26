from unittest import TestCase
from helper.report.report import LocaleReportGenerator
import pandas as pd
import numpy as np


class TestLocaleGenerationReport(TestCase):
    def test_find_keys_with_translation_needed(self):
        expected = {"Maybe": "Maybe"}
        df = pd.DataFrame([{'Key': 'Maybe', 'value': 'Maybe'}, {'Key': 'upto 10 years', 'value': '10 वर्ष तक'}],
                          columns=['Key', 'value'])
        locale_generation_report = LocaleReportGenerator('Hindi', pd.DataFrame(), df, pd.DataFrame())

        translation_needed_content = locale_generation_report.find_translation_needed_content(df)

        self.assertEqual(expected, translation_needed_content)

    def test_convert_excel_df_to_dict(self):
        expected = {
            "upto 10 years": {'English copy': 'upto 10 years', 'Hindi': '10 वर्ष तक'},
            "May be": {'English copy': 'May be', 'Hindi': np.NAN}
        }
        excel_df = pd.DataFrame(
            [
                {'Key': 'May be', 'English copy': 'May be', 'Hindi': np.NAN},
                {'Key': 'upto 10 years', 'English copy': 'upto 10 years', 'Hindi': '10 वर्ष तक'}
            ],
            columns=['Key', 'English copy', 'Hindi']
        )
        locale_generation_report = LocaleReportGenerator('Hindi', excel_df, pd.DataFrame(), pd.DataFrame())

        excel_content = locale_generation_report.convert_excel_df_to_dict()

        self.assertEqual(expected, excel_content)

    def test_find_keys_with_translation_not_needed(self):
        expected = {"upto 10 years": "10 वर्ष तक"}
        json_df = pd.DataFrame([{'Key': 'Maybe', 'value': 'Maybe'},
                                {'Key': 'upto 10 years', 'value': '10 वर्ष तक'}],
                               columns=['Key', 'value'])
        locale_generation_report = LocaleReportGenerator('Hindi', pd.DataFrame(), json_df, pd.DataFrame())

        translation_not_needed_content = locale_generation_report.find_translation_not_needed_content()

        self.assertEqual(expected, translation_not_needed_content)

    def test_find_new_translations_content(self):
        expected = {"Maybe": "शायद"}
        json_df = pd.DataFrame([{'Key': 'Maybe', 'value': 'Maybe'}, {'Key': 'May be', 'value': 'May be'},
                                {'Key': 'upto 10 years', 'value': '10 वर्ष तक'}],
                               columns=['Key', 'value'])
        excel_df = pd.DataFrame(
            [{'Key': 'Maybe', 'English copy': 'Maybe', 'Hindi': 'शायद'},
             {'Key': 'May be', 'English copy': 'May be', 'Hindi': np.NAN},
             {'Key': 'upto 10 years', 'English copy': 'upto 10 years', 'Hindi': '10 वर्ष तक'}],
            columns=['Key', 'English copy', 'Hindi'])
        locale_generation_report = LocaleReportGenerator('Hindi', excel_df, json_df, pd.DataFrame())

        new_translation_content = locale_generation_report.find_new_translations_content()

        self.assertEqual(expected, new_translation_content)

    def test_find_updated_translations_content(self):
        expected = {"upto 10 years": "10 वर्ष"}
        json_df = pd.DataFrame([{'Key': 'Maybe', 'value': 'Maybe'}, {'Key': 'May be', 'value': 'May be'},
                                {'Key': 'upto 10 years', 'value': '10 वर्ष तक'}],
                               columns=['Key', 'value'])
        excel_df = pd.DataFrame(
            [{'Key': 'Maybe', 'English copy': 'Maybe', 'Hindi': 'शायद'},
             {'Key': 'May be', 'English copy': 'May be', 'Hindi': np.NAN},
             {'Key': 'upto 10 years', 'English copy': 'upto 10 years', 'Hindi': '10 वर्ष'}],
            columns=['Key', 'English copy', 'Hindi'])
        locale_generation_report = LocaleReportGenerator('Hindi', excel_df, json_df, pd.DataFrame())

        new_translation_content = locale_generation_report.find_updated_translations_content()

        self.assertEqual(expected, new_translation_content)

    # def test_generate_report(self):
    #     self.fail()
