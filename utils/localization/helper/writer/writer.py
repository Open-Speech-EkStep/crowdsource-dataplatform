from abc import ABC, abstractmethod


class Writer(ABC):

    @abstractmethod
    def write(self, file_name, data):
        pass
