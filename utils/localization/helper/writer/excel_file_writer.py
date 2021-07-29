from helper.writer.writer import Writer


class JsonWriter(Writer):

    def write(self, file_name, data):
        data.to_excel(file_name, index=False, startrow=1)
