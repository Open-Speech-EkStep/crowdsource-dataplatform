import argparse
import os

from helper.report.report import LocaleReportGenerator
from helper.utils.utils import write_df_to_json, write_report
from modules.locale_generator.generator import LocaleGenerator
from modules.locale_generator.excel_input import SingleExcelInput, MultiExcelInput
from modules.locale_generator.utils import read_language_list, get_selected_languages


def main():
    all_languages_list = read_language_list()
    example = '''
            Example commands:

            For specific languages:
                python LocaleGenerator.py -j ./../all_keys_generator/out -e ./input_excel_files -m ./../delta_generation/out-meta -o ./output_json_files -l gu pa

            For all languages:
                python LocaleGenerator.py -j ./../all_keys_generator/out -e ./input_excel_files -m ./../delta_generation/out-meta -o ./output_json_files -a

            -j /Users/nireshkumarr/Documents/ekstep/crowdsource-dataplatform/utils/localisation_script/delta_generation/cleaned_jsons
            -e /Users/nireshkumarr/Documents/ekstep/crowdsource-dataplatform/utils/ofiles/sme-input
            -m /Users/nireshkumarr/Documents/ekstep/crowdsource-dataplatform/utils/ofiles/out-meta
            -o ./output_json_files 
            -t seperate
            -l hi

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
    parser.add_argument("-t", "--type", default='seperate', help="Type of input excel file(s)",
                        choices=['seperate', 'combined'])
    parser.add_argument("-o", "--output-folder-path", required=True,
                        help="Output folder path where excels are generated")

    args = parser.parse_args(
        "-j /Users/nireshkumarr/Documents/ekstep/crowdsource-dataplatform/utils/localisation_script/delta_generation/cleaned_jsons \
            -e /Users/nireshkumarr/Documents/ekstep/crowdsource-dataplatform/utils/ofiles/sme-input \
            -m /Users/nireshkumarr/Documents/ekstep/crowdsource-dataplatform/utils/ofiles/out-meta \
            -o ./output_json_files \
            -t seperate \
            -l hi \
        ".split())

    # for test
    # args = parser.parse_args(
    #     "\
    #     -j crowdsource-dataplatform/utils/localization/resources/test_data/input_jsons \
    #     -e crowdsource-dataplatform/utils/localization/resources/test_data/test-out-sme/hi.xlsx \
    #     -m crowdsource-dataplatform/utils/localization/resources/test_data/test-out-meta/out_meta_5_20.xlsx \
    #     -o ./output \
    #     -t combined \
    #     -l hi \
    #     ".split())

    languages = get_selected_languages(all_languages_list, args.all_languages, args.languages)

    input_base_path = args.excel_path
    input_json_path = args.json_folder_path
    meta_input_path = args.meta_folder_path
    output_base_path = args.output_folder_path

    file_type = args.type
    if file_type == 'combined' and not os.path.isfile(meta_input_path):
        print('Invalid arguments')
        exit()

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

    write_report(all_languages_report, 'locale')

    # move_files(path_to_excels, translation_excel_files)


if __name__ == '__main__':
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
