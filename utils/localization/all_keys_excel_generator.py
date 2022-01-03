import argparse
import os

import pandas as pd

from helper.unused_keys_cleaner import clean_locale_keys
from modules.content_extractor.all_keys_excel_generation import generate_keys, generate_report, generate_output_for_sme, \
    export_report
from helper.utils.utils import read_language_list


def main():
    example = '''
            Example commands:

            For only english content: 
                python all_keys_excel_generator.py -j ./../../crowdsource-fe/public/locales -o 
            ./out/en.xlsx --only-en


            For All language content: 
                python all_keys_excel_generator.py -j ./../../crowdsource-fe/public/locales -o 
            ./out/out.xlsx '''

    parser = argparse.ArgumentParser(epilog=example,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("-j", "--input-json-path", required=True, help="Path of json folder with en keys present")
    parser.add_argument("-o", "--output-excel-path", required=True, help="Output path")
    parser.add_argument("--only-en", action="store_true", help="Include only keys in en/common.json")

    args = parser.parse_args()

    input_json_path = args.input_json_path
    output_excel_path = args.output_excel_path
    only_en = args.only_en

    if '/' in output_excel_path:
        os.makedirs(output_excel_path[:output_excel_path.rindex("/")], exist_ok=True)

    tmp_cleaned_json_path = "cleaned_json_locales_for_all_keys_excel"
    languages = {}
    if not only_en:
        languages = read_language_list()
        clean_locale_keys(languages, input_json_path, tmp_cleaned_json_path)
        input_json_path = tmp_cleaned_json_path

    en_json_path = os.path.join(input_json_path, 'en/common.json')

    all_df = generate_keys(en_json_path, en_json_path, 'en')

    overall_report = {'args': vars(args), 'English': generate_report(list(all_df['Key']))}
    important_dict_keys = ['last_run_timestamp', 'args']

    if not only_en:
        for language_code, language_name in languages.items():
            language_json_path = os.path.join(input_json_path, '{}/common.json'.format(language_code))
            language_df = generate_keys(en_json_path, language_json_path, language_code)
            language_df = language_df.rename(columns={'English copy': language_name})
            language_df = language_df[['Key', language_name]]
            all_df = pd.merge(all_df, language_df, on='Key', how='outer')
            overall_report[language_name] = generate_report(list(language_df['Key']))
        output_excel_path = output_excel_path.replace('.xlsx', '_meta.xlsx')
    all_df.to_excel(output_excel_path, index=False, startrow=1)

    if not only_en:
        cleaned_all_df = generate_output_for_sme(all_df, args.output_excel_path)
        overall_report['metrics'] = {'total_actual_content': len(all_df['English copy']),
                                     'total_unique_content': len(cleaned_all_df['English copy'])}
        important_dict_keys.append('metrics')
    export_report(overall_report, 'all_keys_excel_generation', important_dict_keys)

    if os.path.isdir(tmp_cleaned_json_path):
        os.system("rm -rf " + tmp_cleaned_json_path)


if __name__ == '__main__':
    main()
