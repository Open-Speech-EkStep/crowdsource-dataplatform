#!/usr/bin/env python
# coding: utf-8

# ### Steps:
# 1. Collect keys for all ejs files.
# 2. Keep Main files(html files) and combine the keys of components included with the main keys.
# 3. Give the keys and path of the respective main files.
# 4. Parse js files and find the rest of the keys.
# 5. Map the respective js files with ejs files.
# 
# 
# 
# 1. Read all ejs files and get the keys in them.
# 2. Recursively iterate through the includes of main files only and append the keys.
# 3. Create a dict/df with path as a column.
# 4. Read all js files for the keys.
# 5. Map js files with respective html/ejs files.
# 6. Add their path in the df.

# ##### ISSUES
# 
# 1. Passed as parameters to components and used as keys:
#     - contributionStats.ejs
#         * Language pairs
#         * People participated
#         * Translations validated
#         * Translations done
#         * Duration validated
#         * Languages
#         * Duration transcribed
#         * Speakers contributed
#         * Duration recorded
#         * Images validated
#         * Images labelled
#     - assistiveText.ejs
#         * Type the text from the image
#         * Is the text from the image captured correctly?
#         * Type the translation of the given text
#         * Is the translation correct?
#         * Type the text as you hear the audio
#         * Does the audio match the text?
#     - cards.ejs
#         * Validate the text, labelled by others, as per the image
#         * Type the text as per the image
#         * Type what you hear
#         * Transcribe
#         * Validate the translation contributed by others
#         * Validate text as per the audio
#         * Label
#         * Translate
#         * Translate and type the text
#     - report.ejs
#         * Help us understand what’s wrong with the image labelled
#         * Your feedback helps us keep Suno India relevant, we appreciate you taking time to leave the feedback.
#         * Your feedback helps us keep Likho India relevant, we appreciate you taking time to leave the feedback.
#         * Your feedback helps us keep Dekho India relevant, we appreciate you taking time to leave the feedback.
#     - headerWithoutNavBar.ejs
#         * Dashboard
#         * Transcribe
#         * Label
#         * Translate
#     - breadcrumbs.ejs
#         * Label
#     - downloadableBadges.ejs
#         * bronze
#         * gold
#         * platinum
#         * silver
# 2. Unused keys (Done):
#     - Remove language barriers with BhashaDaan
#     - Your contribution can empower Bhashini to make many such stories happen.
#     - Towards digital empowerment for all...
#     - Beta
#     - Back to Home
#     
# 3. special characters in key (DONE):
#     - Let\'s Go
#     - I've contributed towards building open language repository for India on https://bhashini.gov.in/bhashadaan You and I can make a difference by donating our voices that can help machines learn our language and interact with us through great linguistic applications. Do your bit and empower the language?
#     - Please don't use email or mobile number as user name
# 
# 4. Recursive includes (DONE):
#     - bhasadaanLogoText.ejs
#         * Bhasha
#         * Daan
# 5. \$ variables (DONE):
#     - speakerDetails.ejs
#         * By proceeding ahead you agree to the \<a href="../terms-and-conditions.html" target="_blank"> Terms and Conditions \</a>   - \${path}
#         * By proceeding ahead you agree to the \<a href="./terms-and-conditions.html" target="_blank"> Terms and Conditions\</a> 
#     - badge_milestone.ejs
#         * You've earned a \<span id="current_badge_name_1">\</span> Bhasha Samarthak Badge by contributing \<span id="current_badge_count">\</span> recordings  - \${text}
#         * You've earned a <span id="current_badge_name_1"></span> Bhasha Samarthak Badge by contributing <span id="current_badge_count"></span> sentences. - \${text}
#         * Your next goal is to reach \<span id="next_badge_count">\</span> images to earn your \<span id="next_badge_name_1">\</span> Bhasha Samarthak Badge. - \${text}
#     - languageGoal.ejs
#         * Help your language achieve it’s goal of \<span id="language-hour-goal">\</span> images. We know you can do more! - \${text}
#         * Help your language pair achieve it’s goal of <span id="language-hour-goal"></span> translations. We know you can do more! - \${text}
#     - badgeMilestone.ejs
#         * You've earned a \<span id="current_badge_name_1">\</span> Bhasha Samarthak Badge by labelling \<span id="current_badge_count">\</span> images. - \\${text}, \${text}
# 

# ### Issues
# 
# 1. In assistiveText.ejs , there is a dynamic template, <%= __(msg) %>, contributionStats.ejs - <%= __(labels[0]) %>
# 2. In few templates, there is {text} , {path}
# 3. common folder accessed in ejs is not proper.eg()
# 4. verticalGraph.ejs is duplicate in common folder.
# 5. Level - key is not identified in badges.ejs

# In[1]:


import json
import re
import os
import pathlib


# In[2]:


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
                k = re.sub(r"<%(=|-) __\(('|`)","",k)
                k = re.sub(r"('|`)\)\s*%>","",k)
                k = k.replace("\\","")
                keys_list.append(k)
                
            _regex = r"__\('(.*?)'\)"
            _matches = re.finditer(_regex, readfile, re.MULTILINE)
            for match in _matches:
                k = match.group()
                k = re.sub(r"__\('","",k)
                k = re.sub(r"'\)","",k)
                k = k.replace("\\","")
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
                    k = base_path +"/"+ k.replace("'","").replace("'","")
                except Exception as e:
                    if str(e) == "substring not found":
                        start_index = k.index("<%- include") + 12 
                        end_index = k.index("%>") - 1
                        k = k[start_index:end_index].strip()
                        k = k[:-1] if k.endswith('%') else k
                        k = base_path +"/"+ k.replace("'","").replace("'","") + ".ejs"
                    else:
                        print(k , e)
                includes_list.append(k)
        ejs_keys_map[path] = { 'keys' : keys_list, 'includes': includes_list }
    return ejs_keys_map


# In[3]:


def extract_key_from_template(text):
    keys_list = []
    regex = r"<%(-|=) __(.*?)\s*%>"
    matches = re.finditer(regex, text, re.MULTILINE)
    for match in matches:
        k = match.group()
        k = re.sub(r"<%(=|-) __\(('|`)","",k)
        k = re.sub(r"('|`)\)\s*%>","",k)
        k = k.replace("\\","")
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
            k = k.replace("\n","")
            keys = extract_key_from_template(k)
            if len(keys) != 0:
                if "data-name" in k:
                    file_name = k[k.index('data-name="')+11: k.rindex('"')]
                    k_path_map[keys[0]] = base_path+"/"+file_name
    return k_path_map


# In[6]:


def is_templated_key_present(templated_key, actual_key):
    regex = re.sub('\${.*}','(.*)', templated_key)
    if "(.*)" not in regex or len(regex.replace('(.*)','').strip()) == 0:
        return False
    actual_key = actual_key.replace("\\","")
    matches = re.finditer(r""+regex, actual_key, re.MULTILINE)
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
    key_map = get_keys_from_ejs([base_path+"/"+main_ejs_file for _, main_ejs_file in main_files_map.items()])
    fileExt = r"**/*.ejs"
    common_folder_ejs_files = list(pathlib.Path(base_path+'/common').glob(fileExt))
    i_key_path_map = get_identified_key_path_map(key_map, common_folder_ejs_files)
    with open('./../../crowdsource-ui/locales/en.json') as f:
        en_data = json.load(f)
    en_data_keys = set(en_data.keys())
    key_gen_tags = read_key_gen(base_path+'/key_gen.ejs', base_path)
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


def get_keys_with_path():
    main_files_map = {"likhoIndia/dashboard.html":'modules/likhoIndia/dashboard/dashboard.ejs',
     "boloIndia/home.html":'modules/boloIndia/home/home.ejs',
     "sunoIndia/record.html":'modules/sunoIndia/record/record.ejs',
     "terms-and-conditions.html":'terms-and-conditions.ejs',
     "record.html":'record.ejs',
     "dekhoIndia/thank-you.html":'modules/dekhoIndia/thankyou/contribution/thank-you.ejs',
     "dekhoIndia/validator-page.html":'modules/dekhoIndia/validation/validator-prompt-page.ejs',
     "likhoIndia/validator-thank-you.html":'modules/likhoIndia/thankyou/validation/validator-thank-you.ejs',
     "likhoIndia/thank-you.html":'modules/likhoIndia/thankyou/contribution/thank-you.ejs',
     "home.html":'home.ejs',
     "validator-page.html":'validator-prompt-page.ejs',
     "sunoIndia/home.html":'modules/sunoIndia/home/home.ejs',
     "sunoIndia/thank-you.html":'modules/sunoIndia/thankyou/contribution/thank-you.ejs',
     "dekhoIndia/dashboard.html":'modules/dekhoIndia/dashboard/dashboard.ejs',
     "validator-thank-you.html":'validator-thank-you.ejs',
     "not-found.html":'not-found.ejs',
     "thank-you.html":'thank-you.ejs',
     "sunoIndia/validator-page.html":'modules/sunoIndia/validation/validator-prompt-page.ejs',
     "sunoIndia/validator-thank-you.html":'modules/sunoIndia/thankyou/validation/validator-thank-you.ejs',
     "sunoIndia/dashboard.html":'modules/sunoIndia/dashboard/dashboard.ejs',
     "dekhoIndia/home.html":'modules/dekhoIndia/home/home.ejs',
     "badges.html":'badges.ejs',
     "likhoIndia/validator-page.html":'modules/likhoIndia/validation/validator-prompt-page.ejs',
     "dekhoIndia/record.html":'modules/dekhoIndia/record/record.ejs',
     "dashboard.html":'dashboard.ejs',
     "likhoIndia/home.html":'modules/likhoIndia/home/home.ejs',
     "dekhoIndia/validator-thank-you.html":'modules/dekhoIndia/thankyou/validation/validator-thank-you.ejs',
     "likhoIndia/record.html":'modules/likhoIndia/record/record.ejs'}

    cwd = os.getcwd()
    base_path = cwd[:cwd.index('utils/localisation_script')]+'crowdsource-ui/src/views'
#     print(base_path)
    kf_map = get_key_map(base_path, main_files_map)
    out_map = {}
    for k,path in kf_map.items():
        path = path[path.index("views/")+6:]
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

