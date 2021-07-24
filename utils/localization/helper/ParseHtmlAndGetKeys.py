import json
import pathlib
import re


# In[2]:
def read_json(json_file_path):
    with open(json_file_path) as f:
        data = json.load(f)
    return data


def get_keys_from_ejs(filelist):
    ejs_keys_map = {}
    for path in filelist:
        path = str(path)
        keys_list = []
        includes_list = []
        with open(path, "r") as f:
            base_path = '/'.join(path.split('/')[:-1])
            readfile = f.read()

            regex = r"<%(-|=) __(.*?)\s*%>"
            matches = re.finditer(regex, readfile, re.MULTILINE)
            for match in matches:
                k = match.group()
                k = re.sub(r"<%(=|-) __\(('|`)", "", k)
                k = re.sub(r"('|`)\)\s*%>", "", k)
                k = k.replace("\\", "")
                keys_list.append(k)

            _regex = r"__\('(.*?)'\)"
            _matches = re.finditer(_regex, readfile, re.MULTILINE)
            for match in _matches:
                k = match.group()
                k = re.sub(r"__\('", "", k)
                k = re.sub(r"'\)", "", k)
                k = k.replace("\\", "")
                keys_list.append(k)

            includes_regex = r"<%- include(.*?)\s*%>"
            includes_matches = re.finditer(includes_regex, readfile, re.MULTILINE)
            for match in includes_matches:
                k = match.group()
                try:
                    start_index = k.index("<%- include") + 12
                    end_index = k.index("ejs") + 4
                    k = k[start_index:end_index].strip()
                    k = k[:-1] if k.endswith('%') else k
                    k = base_path + "/" + k.replace("'", "").replace("'", "")
                except Exception as e:
                    if str(e) == "substring not found":
                        start_index = k.index("<%- include") + 12
                        end_index = k.index("%>") - 1
                        k = k[start_index:end_index].strip()
                        k = k[:-1] if k.endswith('%') else k
                        k = base_path + "/" + k.replace("'", "").replace("'", "") + ".ejs"
                    else:
                        print(k, e)
                includes_list.append(k)
        ejs_keys_map[path] = {'keys': keys_list, 'includes': includes_list}
    return ejs_keys_map


# In[3]:


def extract_key_from_template(text):
    keys_list = []
    regex = r"<%(-|=) __(.*?)\s*%>"
    matches = re.finditer(regex, text, re.MULTILINE)
    for match in matches:
        k = match.group()
        k = re.sub(r"<%(=|-) __\(('|`)", "", k)
        k = re.sub(r"('|`)\)\s*%>", "", k)
        k = k.replace("\\", "")
        keys_list.append(k)
    return keys_list


# In[4]:


def fetch_keys_in_includes(includes_file_name, common_folder_ejs_files):
    keys = []
    k_map = get_keys_from_ejs([includes_file_name])

    for path, keys_and_includes_list in k_map.items():
        keys = keys + keys_and_includes_list["keys"]
        if len(keys_and_includes_list["includes"]) == 0:
            continue
        for includes_path in keys_and_includes_list["includes"]:
            kys = []
            if "common" in includes_path:
                in_file_name = includes_path.split('/')[-1]
                for common_file in common_folder_ejs_files:
                    if in_file_name == str(common_file).split('/')[-1]:
                        kys = fetch_keys_in_includes(common_file, common_folder_ejs_files)
                        break
            else:
                kys = fetch_keys_in_includes(includes_path, common_folder_ejs_files)
            keys = keys + kys
    return keys


# In[5]:


def read_key_gen(file_path, base_path):
    with open(file_path, 'r') as f:
        readfile = f.read()
        regex = r"<p(.*)>((.|\n)*?)</p>"
        matches = re.finditer(regex, readfile, re.MULTILINE)
        k_path_map = {}
        for match in matches:
            k = match.group()
            k = k.replace("\n", "")
            keys = extract_key_from_template(k)
            if len(keys) != 0:
                if "data-name" in k:
                    file_name = k[k.index('data-name="') + 11: k.rindex('"')]
                    k_path_map[keys[0]] = base_path + "/" + file_name
    return k_path_map


# In[6]:


def is_templated_key_present(templated_key, actual_key):
    regex = re.sub('\${.*}', '(.*)', templated_key)
    if "(.*)" not in regex or len(regex.replace('(.*)', '').strip()) == 0:
        return False
    actual_key = actual_key.replace("\\", "")
    matches = re.finditer(r"" + regex, actual_key, re.MULTILINE)
    match = next(matches, None)
    if match is not None:
        return True

    return False


# In[7]:


def get_identified_key_path_map(key_map, common_folder_ejs_files):
    i_key_path_map = {}

    for path, keys_and_includes_list in key_map.items():
        main_ejs_keys = keys_and_includes_list['keys']
        for includes_path in keys_and_includes_list['includes']:
            if "common" in includes_path:
                in_file_name = includes_path.split('/')[-1]
                for common_file in common_folder_ejs_files:
                    if in_file_name == str(common_file).split('/')[-1]:
                        kys = fetch_keys_in_includes(common_file, common_folder_ejs_files)
                        main_ejs_keys = main_ejs_keys + kys
            else:
                try:
                    includes_keys = fetch_keys_in_includes(includes_path, common_folder_ejs_files)
                    main_ejs_keys = main_ejs_keys + includes_keys
                except Exception as e:
                    print(path, e)
        for mk in main_ejs_keys:
            if mk not in i_key_path_map:
                i_key_path_map[mk] = path
    return i_key_path_map


# In[8]:


def get_key_map(base_path, main_files_map):
    key_map = get_keys_from_ejs([base_path + "/" + main_ejs_file for _, main_ejs_file in main_files_map.items()])
    fileExt = r"**/*.ejs"
    common_folder_ejs_files = list(pathlib.Path(base_path + '/common').glob(fileExt))
    i_key_path_map = get_identified_key_path_map(key_map, common_folder_ejs_files)
    en_data = read_json(base_path.replace("/src/views", "") + '/locales/en.json')
    en_data_keys = set(en_data.keys())
    key_gen_tags = read_key_gen(base_path + '/key_gen.ejs', base_path)
    un_matched_keys = []
    key_file_map = {}
    for key in en_data_keys:
        found = False
        for k in set(i_key_path_map.keys()):
            if key == k or is_templated_key_present(k, key):
                found = True
                key_file_map[key] = i_key_path_map[k]
                break
        if not found:
            for kg_key, kg_path in key_gen_tags.items():
                if key == kg_key:
                    found = True
                    key_file_map[key] = kg_path
                    break
            if not found:
                un_matched_keys.append(key)
    #     print(un_matched_keys)
    #     print(len(key_file_map.keys()), len(en_data_keys), len(un_matched_keys))
    return key_file_map


# In[9]:


def get_keys_with_path(base_path):
    main_files_map = read_json('./../html_ejs_mapping.json')

    kf_map = get_key_map(base_path, main_files_map)
    out_map = {}
    for k, path in kf_map.items():
        path = path[path.index("views/") + 6:]
        for html_path, ejs_path in main_files_map.items():
            if ejs_path == path:
                out_map[k] = html_path
    return out_map


# In[10]:


# to_find_in_js = set(un_matched_keys).difference(set(ignore_keys))
# un_matched_keys


# In[11]:

if __name__ == "__main__":
    get_keys_with_path()
