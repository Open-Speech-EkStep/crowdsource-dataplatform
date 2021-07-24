import os


def create_dirs(file_path):
    if '/' in file_path:
        os.makedirs(file_path[:file_path.rindex("/")], exist_ok=True)
