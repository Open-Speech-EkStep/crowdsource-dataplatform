import json

from helper.writer.writer import Writer


class JsonWriter(Writer):

    def write(self, file_name, data):
        with open(file_name, 'w') as f:
            f.write(json.dumps(data, indent=4, ensure_ascii=False))
