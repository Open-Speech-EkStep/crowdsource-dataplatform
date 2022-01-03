from helper.reader.reader import Reader
import pandas as pd


class ExcelReader(Reader):

    def read(self, file_name, *args, **kwargs):
        if file_name is None:
            raise ValueError('File name not present')
        excel_df = pd.DataFrame()
        excel = pd.ExcelFile(file_name)
        for sheet_name in excel.sheet_names:
            sheet = excel.parse(sheet_name=sheet_name, header=1)
            if len(sheet.columns) == 0:
                continue
            excel_df = pd.concat([excel_df, sheet], axis=0)
        return excel_df

    def read_as_df(self, file_name, columns):
        excel_df = pd.DataFrame([], columns=columns)
        excel = pd.ExcelFile(file_name)
        for sheet_name in excel.sheet_names:
            sheet = excel.parse(sheet_name=sheet_name, header=1)
            if len(sheet.columns) == 0:
                continue
            excel_df = pd.concat([excel_df, sheet], axis=0)
        return excel_df

    def read_files(self, file_list, columns=None, *args, **kwargs):
        if columns is None:
            columns = []
        if file_list is None:
            raise ValueError('Invalid File list')
        excel_df = pd.DataFrame([], columns=columns)
        for excel_file_name in file_list:
            excel_file_df = self.read_as_df(excel_file_name, columns)
            excel_df = pd.concat([excel_df, excel_file_df], axis=0)
        return excel_df
