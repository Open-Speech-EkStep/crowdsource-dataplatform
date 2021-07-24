from abc import ABC, abstractmethod


class Reader(ABC):

    @abstractmethod
    def read(self, file_name):
        pass

    @abstractmethod
    def read_files(self, file_list):
        pass
