import argparse
import os

from helper.unused_keys_cleaner import clean_locale_keys
from modules.content_extractor.all_keys_json_generation import generate, get_modified_content, get_keys_by_action, \
    clean_old_translations, generate_report
from helper.utils.utils import read_language_list


def main():
    languages = read_language_list()
    example = '''
            Example commands:

            To run with auto-generated excel from all_keys_excel_generation.py: 
                python all_keys_json_generator.py -i ./../../crowdsource-fe/public/locales 
                -e ./out/en.xlsx -o ./all_keys_json_out 

            To run with manually generated excel with the 4 categories('TTS Initiative', 'ASR Initiative', 'Translation Initiative', 
            'OCR Initiative'): 
                python all_keys_json_generator.py -i ./../../crowdsource-fe/public/locales
                -e resources/test_data/all_keys_json_input/English_content.xlsx -o ./all_keys_json_out -c manual 

        '''

    parser = argparse.ArgumentParser(epilog=example,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("-c", "--input-category", default='auto-generated', help="Format of the input used",
                        choices=['auto-generated', 'manual'])
    parser.add_argument("-i", "--input-base-path", required=True, help="Path of folder with all jsons present")
    parser.add_argument("-e", "--input-excel-path", required=True, help="Path of excel file")
    parser.add_argument("-o", "--output-json-path", required=True, help="Output path")

    args = parser.parse_args()

    input_excel_path = args.input_excel_path
    input_base_path = args.input_base_path
    input_json_path = os.path.join(input_base_path, 'en/common.json')
    output_json_path = args.output_json_path
    input_category = args.input_category

    os.makedirs(output_json_path, exist_ok=True)

    excel_df, json_df = generate(input_excel_path, input_json_path, output_json_path, input_category)

    modified_content = get_modified_content(excel_df, json_df)
    added_content_keys = get_keys_by_action(excel_df, json_df, 'addition')
    clean_old_translations(list(modified_content.keys()), added_content_keys, languages, input_base_path,
                           output_json_path)
    clean_locale_keys(languages, output_json_path, output_json_path)

    generate_report(json_df, excel_df, modified_content)


if __name__ == '__main__':
    main()
