import argparse
import os

from helper.unused_keys_cleaner import clean_locale_jsons
from modules.delta_generator.generator import gen_delta, generate_report
from helper.utils.utils import read_language_list, get_selected_languages

if __name__ == '__main__':
    all_languages_list = read_language_list()

    keys_without_translation = {}
    example = '''
            Example commands:

            For specific languages:
                python DeltaGenerator.py -i ./../all_keys_generator/out -o . -l gu pa

            For all languages:
                python DeltaGenerator.py -i ./../all_keys_generator/out -o . -a
        '''

    parser = argparse.ArgumentParser(epilog=example,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("-a", "--all-languages", action="store_true",
                       help="Generate delta for all languages")
    group.add_argument("-l", "--languages", nargs="+",
                       help="Generate delta for the languages mentioned by language codes(space separated)",
                       choices=list(all_languages_list.keys()))
    parser.add_argument("-i", "--input-folder-path", required=True, help="Input folder path with json files present")
    parser.add_argument("-v", "--views-folder-path",
                        help="Source code path(views folder) to identify the location of "
                             "keys in source code")
    parser.add_argument("-o", "--output-folder-path", required=True,
                        help="Output folder path where excels are generated")
    parser.add_argument("--all-keys", action="store_true", default=False,
                        help="Consider all keys while generating excel")

    args = parser.parse_args()
    all_keys = args.all_keys
    ejs_files_base_path = args.views_folder_path

    languages = get_selected_languages(all_languages_list, args.all_languages, args.languages)

    input_base_path = args.input_folder_path
    output_base_path = args.output_folder_path

    meta_out_base_path = os.path.join(output_base_path, 'out-meta/')
    sme_out_base_path = os.path.join(output_base_path, 'out-sme/')

    tmp_cleaned_json_path = "cleaned_json_locales_for_delta_generation"
    clean_locale_jsons(languages, input_base_path, tmp_cleaned_json_path)
    input_base_path = tmp_cleaned_json_path

    gen_delta(languages.items(), input_base_path, meta_out_base_path, sme_out_base_path, all_keys,
              keys_without_translation, ejs_files_base_path)
    generate_report(keys_without_translation)

    if os.path.isdir(tmp_cleaned_json_path):
        os.system("rm -rf " + tmp_cleaned_json_path)