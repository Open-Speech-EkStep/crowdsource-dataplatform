class LocaleOutData:

    def __init__(self, json_df, excel_df, final_df):
        self._json_df = json_df
        self._excel_df = excel_df
        self._final_df = final_df

    def get_json_df(self):
        return self._json_df

    def get_final_df(self):
        return self._final_df

    def get_excel_df(self):
        return self._excel_df