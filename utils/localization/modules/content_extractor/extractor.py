import pandas as pd
import os
import argparse
from modules.content_extractor.reader.json_file_reader import JsonReader
from modules.content_extractor.writer.json_file_writer import JsonWriter
from modules.content_extractor.parser.json_parser import TagParser
from helper.ParseHtmlAndGetKeys import get_keys_with_path


def add_path_column(keys, keys_with_path_dict):
    pass


if __name__ == '__main__':
    example = '''
            Example commands:

            For only english content:
                python AllKeysExcelGenerator.py -j ./../../../crowdsource-ui/locales -o ./out/en.xlsx --only-en


            For All language content:
                python AllKeysExcelGenerator.py -j ./../../../crowdsource-ui/locales -o ./out/out.xlsx
        '''

    parser = argparse.ArgumentParser(epilog=example,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("-j", "--input-json-path", required=True, help="Path of json folder with en keys present")
    parser.add_argument("-o", "--output-excel-path", required=True, help="Output path")
    parser.add_argument("--only-en", action="store_true", help="Include only keys in en.json")

    args = parser.parse_args("-j ./out/ -o ./out/out.xlsx".split())

    input_json_path = args.input_json_path
    output_folder_path = args.output_excel_path
    only_en = args.only_en

    keys_with_path_map = get_keys_with_path()
    allowed_replacements = ["u", "v", "w", "x", "y", "z"]

    tag_parser = TagParser(allowed_replacements)
    reader = JsonReader(tag_parser)
    writer = JsonWriter(output_folder_path)

    if only_en:
        en_json_path = os.path.join(input_json_path, 'en.json')
        data = reader.read(en_json_path)
        data = tag_parser.parse(data)
        add_path_column(data)
        output_data = to_pandas_df(data)
        writer.write(output_folder_path, output_data)
    else:
        pass

    # overall_report = {}
    # overall_report['args'] = vars(args)
    # overall_report['English'] = generate_report(list(all_df['Key']))
    # important_dict_keys = ['last_run_timestamp', 'args']

    if not only_en:
        languages = read_json('./../languages.json')
        for language_code, language_name in languages.items():
            language_json_path = os.path.join(input_json_path, '{}.json'.format(language_code))
            language_df = generate_keys(language_json_path, keys_with_path_map)
            language_df = language_df.rename(columns={'English copy': language_name})
            language_df = language_df[['Key', language_name]]
            all_df = pd.merge(all_df, language_df, on='Key', how='outer')
            overall_report[language_name] = generate_report(list(language_df['Key']))
        output_folder_path = output_folder_path.replace('.xlsx', '_meta.xlsx')
    all_df.to_excel(output_folder_path, index=False, startrow=1)

    if not only_en:
        cleaned_all_df = generate_output_for_sme(all_df, args.output_excel_path)
        overall_report['metrics'] = {'total_actual_content': len(all_df['English copy']),
                                     'total_unique_content': len(cleaned_all_df['English copy'])}
        important_dict_keys.append('metrics')
    export_report(overall_report, 'excel', important_dict_keys)
