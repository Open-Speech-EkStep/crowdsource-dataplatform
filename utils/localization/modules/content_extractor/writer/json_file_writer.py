import json
from modules.content_extractor.writer.writer import Writer
from modules.content_extractor.writer.operations import create_dirs


class JsonWriter(Writer):

    def __init__(self, output_file_path):
        self.output_file_path = output_file_path
        create_dirs(self.output_file_path)

    def write(self, file_name, data):
        pass
