import argparse
import os

from helper.unused_keys_cleaner import clean_locale_keys
from helper.report.report import LocaleReportGenerator
from helper.utils.utils import write_df_to_json, write_report, read_language_list, get_selected_languages
from modules.locale_generator.generator import LocaleGenerator
from modules.locale_generator.excel_input import SingleExcelInput, MultiExcelInput


def main():
    all_languages_list = read_language_list()
    example = '''
            Example commands:

            For specific languages taking single translation file that has all languages as input:
                python locale_generator.py -j ./../../crowdsource_ui/locales 
                                           -e ./translation_excel_files 
                                           -m ./translation_meta_files 
                                           -o ./locale_output 
                                           -t combined
                                           -l gu pa
            
            For specific languages taking separate translation files for each language as input:
                python locale_generator.py -j ./../../crowdsource_ui/locales 
                                               -e ./translation_excel_files 
                                               -m ./translation_meta_files 
                                               -o ./locale_output 
                                               -t separate
                                               -l gu pa 

            For all languages taking single translation file that has all languages as input:
                python locale_generator.py -j ./../../crowdsource_ui/locales 
                                               -e ./translation_excel_files 
                                               -m ./translation_meta_files 
                                               -o ./locale_output 
                                               -t combined
                                               -a
                                               
            For all languages taking separate translation files for each language as input:
                python locale_generator.py -j ./../../crowdsource_ui/locales 
                                               -e ./translation_excel_files 
                                               -m ./translation_meta_files 
                                               -o ./locale_output 
                                               -t separate
                                               -a
        '''

    parser = argparse.ArgumentParser(epilog=example,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("-a", "--all-languages", action="store_true", help="Generate delta for all languages")
    group.add_argument("-l", "--languages", nargs="+",
                       help="Generate delta for the languages mentioned by language codes(space separated)",
                       choices=list(all_languages_list.keys()))

    parser.add_argument("-e", "--excel-path", required=True, help="Input folder path with excel files present")
    parser.add_argument("-j", "--json-folder-path", required=True, help="Input folder path with json files present")
    parser.add_argument("-m", "--meta-folder-path", required=True,
                        help="Input folder path with meta files for the excels present")
    parser.add_argument("-t", "--type", default='separate', help="Type of input excel file(s)",
                        choices=['separate', 'combined'])
    parser.add_argument("-o", "--output-folder-path", required=True,
                        help="Output folder path where excels are generated")

    args = parser.parse_args()

    languages = get_selected_languages(all_languages_list, args.all_languages, args.languages)

    input_base_path = args.excel_path
    input_json_path = args.json_folder_path
    meta_input_path = args.meta_folder_path
    output_base_path = args.output_folder_path

    file_type = args.type
    if file_type == 'combined' and not os.path.isfile(meta_input_path):
        print('Invalid arguments')
        exit()

    tmp_cleaned_json_path = "cleaned_json_locales_for_locale_generation"
    clean_locale_keys(languages, input_json_path, tmp_cleaned_json_path)
    input_json_path = tmp_cleaned_json_path

    if file_type == 'combined':
        excel_input = SingleExcelInput(input_json_path, input_base_path, meta_input_path)
    else:
        excel_input = MultiExcelInput(input_json_path, input_base_path, meta_input_path)

    language_output_map = LocaleGenerator(excel_input, languages).generate()

    os.makedirs(output_base_path, exist_ok=True)
    all_languages_report = {}
    for language_code, language_out_data in language_output_map.items():
        output_json_path = '{base_path}/{language}.json'.format(base_path=output_base_path, language=language_code)
        write_df_to_json(language_out_data.get_final_df(), output_json_path)

        locale_report_generator = LocaleReportGenerator(languages[language_code], language_out_data.get_excel_df(),
                                                        language_out_data.get_json_df(),
                                                        language_out_data.get_final_df())
        report = locale_report_generator.generate_report()
        all_languages_report[languages[language_code]] = report

    write_report(all_languages_report, 'locale_generation')
    os.system("cp {} {}".format(os.path.join(input_json_path, 'en.json'), output_base_path))

    if os.path.isdir(tmp_cleaned_json_path):
        os.system("rm -rf " + tmp_cleaned_json_path)

    # move_files(path_to_excels, translation_excel_files)


if __name__ == '__main__':
    # for test
    # args_list = "\
    # -j crowdsource-dataplatform/utils/localization/resources/test_data/input_jsons \
    # -e crowdsource-dataplatform/utils/localization/resources/test_data/test-out-sme/hi.xlsx \
    # -m crowdsource-dataplatform/utils/localization/resources/test_data/test-out-meta/out_meta_5_20.xlsx \
    # -o ./output \
    # -t combined \
    # -l hi \
    # ".split()

    main()

# read json
# if json empty (should exit script but decided to allow)
# clean json df
# read meta excel
# if meta excel empty (should not allow - exit)
# clean excel df
# read sme excel
# if sme excel (should exit language procedure with message - No data found)
# clean excel df
# join meta and sme excel - merged excel
# if no data found, meta - sme mismatch error
# clean merged df
# join json and merged excel - final df
# clean final df
# filter and write final df
