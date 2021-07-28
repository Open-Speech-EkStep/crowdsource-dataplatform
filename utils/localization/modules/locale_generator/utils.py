import json
import pandas as pd
import glob
import os


def read_json(json_file_path):
    with open(json_file_path) as f:
        data = json.load(f)
    return data


def reformat_json(json_obj):
    json_dict = {}
    for key, value in json_obj:
        json_dict[key] = value
    return json_dict


def load_json_as_df(json_data):
    out_df = pd.DataFrame(list(json_data.items()),
                          columns=['Key', 'value'])
    return out_df


# unused
def get_matched_count(excel_df, merged_df):
    count = 0
    for key in excel_df['Key']:
        for k_key in merged_df['Key']:
            if key == k_key:
                count += 1
                break
    return count


def read_excel_as_df(filename, columns: list):
    excel_df = pd.DataFrame([], columns=columns)
    excel = pd.ExcelFile(filename)
    for sheet_name in excel.sheet_names:
        sheet = excel.parse(sheet_name=sheet_name, header=1)
        if len(sheet.columns) == 0:
            continue
        excel_df = pd.concat([excel_df, sheet], axis=0)
    return excel_df


def read_excels_as_df(filenames, columns: list):
    excel_df = pd.DataFrame([], columns=columns)
    for excel_file_name in filenames:
        excel_file_df = read_excel_as_df(excel_file_name, columns)
        excel_df = pd.concat([excel_df, excel_file_df], axis=0)
    return excel_df


def excel_filter(excel_file_name):
    return os.path.isfile(excel_file_name) and excel_file_name.endswith('.xlsx') and not excel_file_name.split('/')[
        -1].startswith('~')


def get_excel_files(dir_name):
    list_of_files = filter(excel_filter, glob.glob(dir_name + '/*'))
    list_of_files = sorted(list_of_files, key=os.path.getmtime)
    return list_of_files


def move_files(base_path, filenames):
    done_folder = base_path + "/done"
    os.makedirs(done_folder, exist_ok=True)
    for file_name in filenames:
        os.system('mv {} {}'.format(file_name, done_folder))
