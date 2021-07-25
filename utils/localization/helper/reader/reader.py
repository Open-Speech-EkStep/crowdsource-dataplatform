from abc import ABC, abstractmethod


class Reader(ABC):

    @abstractmethod
    def read(self, file_name, *args, **kwargs):
        pass

    @abstractmethod
    def read_as_df(self, file_name, columns):
        pass

    @abstractmethod
    def read_files(self, file_list, *args, **kwargs):
        pass
