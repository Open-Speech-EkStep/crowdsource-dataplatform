import json
from modules.content_extractor.reader.reader import Reader


class JsonReader(Reader):
    def __init__(self, parser):
        self.parser = parser

    def read(self, file_name):
        if file_name is None:
            raise ValueError('File name not present')
        with open(file_name, 'r') as json_file:
            return json.load(json_file)

    def read_files(self, file_list):
        if file_list is None:
            raise ValueError('Invalid File list')
        data_list = []
        for file in file_list:
            with open(file, 'r') as json_file:
                data_list.append(json.load(json_file))
        return data_list

    def parse(self, data):
        return self.parser.parse(data)
