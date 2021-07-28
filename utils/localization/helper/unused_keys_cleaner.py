import argparse
import json
import os
from datetime import datetime

from helper.utils.utils import read_language_list, write_report


def read_json(json_path):
    with open(json_path, 'r') as f:
        return json.load(f)


def generate_report():
    now = datetime.now()

    report = {'last_run_timestamp': str(now), 'keys_removed_from_all_files': list(set(removed_keys))}

    write_report(report, 'locale_cleaning')


def clean_locale_jsons(languages, input_base_path, output_base_path):
    en_json_path = '{}/en.json'.format(input_base_path)
    en_data = read_json(en_json_path)

    for language_code, lang_name in languages:

        locale_path = '{input_base_path}/{language_code}.json'.format(input_base_path=input_base_path,
                                                                      language_code=language_code)
        data = read_json(locale_path)

        data_copy = data.copy()

        for key, value in data_copy.items():
            if key not in en_data.keys():
                del data[key]
                removed_keys.append(key)

        output_file_path = '{output_base_path}/{language_code}.json'.format(output_base_path=output_base_path,
                                                                            language_code=language_code)

        with open(output_file_path, 'w') as f:
            f.write(json.dumps(data, indent=4, ensure_ascii=False))


if __name__ == '__main__':

    LANGUAGES = read_language_list()

    removed_keys = []

    example = '''
            Example commands:

            For specific languages:
                python unused_keys_cleaner.py -i ./../../../crowdsource-ui/locales -o . -l gu pa

            For all languages:
                python unused_keys_cleaner.py -i ./../../../crowdsource-ui/locales -o . -a
        '''

    parser = argparse.ArgumentParser(epilog=example,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("-a", "--all-languages", action="store_true", help="Clean json for all languages")
    group.add_argument("-l", "--languages", nargs="+",
                       help="Clean json for the languages mentioned by language codes(space separated)",
                       choices=list(LANGUAGES.keys()))
    parser.add_argument("-i", "--input-folder-path", required=True, help="Input folder path with json files present")
    parser.add_argument("-o", "--output-folder-path", required=True,
                        help="Output folder path to save cleaned jsons files")

    args = parser.parse_args(
        "-i /Users/nireshkumarr/Documents/ekstep/crowdsource-dataplatform/crowdsource-ui/locales -o cleaned_jsons -a".split())
    languages = {}
    if args.all_languages:
        languages = LANGUAGES.copy()
    else:
        language_codes = args.languages
        for code in language_codes:
            languages[code] = LANGUAGES[code]

    input_base_path = args.input_folder_path
    output_base_path = args.output_folder_path
    os.makedirs(output_base_path, exist_ok=True)

    clean_locale_jsons(languages.items(), input_base_path, output_base_path)
    generate_report()
