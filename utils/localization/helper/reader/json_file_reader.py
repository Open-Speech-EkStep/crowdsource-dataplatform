import json
import pandas as pd

from helper.reader.reader import Reader


class JsonReader(Reader):

    def read(self, file_name, *args, **kwargs):
        if file_name is None:
            raise ValueError('File name not present')
        with open(file_name, 'r') as json_file:
            return json.load(json_file)

    def read_as_df(self, file_name, columns=None):
        if columns is None:
            columns = ['Key', 'value']
        json_data = self.read(file_name)
        json_df = pd.DataFrame(list(json_data.items()), columns=columns)
        return json_df

    def read_files(self, file_list, *args, **kwargs):
        if file_list is None:
            raise ValueError('Invalid File list')
        data_list = []
        for file in file_list:
            json_file = self.read(file)
            data_list.append(json.load(json_file))
        return data_list
