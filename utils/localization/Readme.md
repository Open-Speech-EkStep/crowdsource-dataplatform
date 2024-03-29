This utility allows users to generate excel file(with all keys / delta keys) from the locale files and repopulate the locale files with corrections and translations.

#### Summary:
    Step 1: Generate all keys into an excel file from the current locale json files and it can be shared for corrections/updations.
    Step 2: Using the updated excel file, new locale json files are created. This step involves cleaning of unused keys in other languages(except en).
    Step 3: From the newly created locale json files, delta is generated(along with metadata files). This files in out-sme can be shared for translations to be updated.
    Step 4: On receiving the excel files with translations, locale json files are updated with the respective translations.

#### Setup:
1. Note: Required python version >= 3

2. Run the following command to install python libraries:  `pip install -r requirements.txt`

3. `resources/languages.json` has list of all languages to be considered. If you want to add a new language, add it in this json file in given format - `{"<language-code>":"<language-name>"}`.

    ```
    Eg:
    {
    "hi": "Hindi",
    "gu": "Gujarati",
    "as": "Assamese",
    }
    ```

#### All Keys excel file generation:

1. To generate from 'en' locale file, run from the following:
   ```
   python all_keys_excel_generator.py -j ./../../crowdsource-fe/public/locales -o ./out/en.xlsx --only-en
   ```

   This `./out/en.xlsx` obtained from the above step will have all keys from en locale file and can be shared with people for corrections in values.

   Or

   To generate for all languages, run from the following:
   ```
   python all_keys_excel_generator.py -j ./../../crowdsource-fe/public/locales -o ./out/out.xlsx
   ```

   The `./out/out_sme.xlsx` obtained from the above step will have all language content from locale files and can be shared with people for corrections in values.

(For more info on above command, use -h for help)

#### After correction is done:

1. Run the following command to repopulate the 'en' locale file and update all other locale files
   - To run with auto-generated excel from AllKeysExcelGenerator.py:
   ```
   python all_keys_json_generator.py -i ./../../crowdsource-fe/public/locales -e ./out/en.xlsx -o ./all_keys_json_out
   ```
   - To run with manually generated excel with the 4 categories('TTS Initiative', 'ASR Initiative', 'Translation Initiative', 'OCR Initiative'):
   ```
   python all_keys_json_generator.py -i ./../../crowdsource-fe/public/locales -e resources/test_data/all_keys_json_input/English_content.xlsx -o ./all_keys_json_out -c manual
   ```

(For more info on above command, use -h for help)
In `./out/` folder all locale files are generated after the above command is ran. This will have all the updated corrections. This folder should be used in delta generation. 

#### Below described are the possibilities:
```
 only-delta, all-keys
    1. separate sheets - all languages
    2. separate sheets - specific languages
    3. single sheet - all languages
    4. single sheet - specific languages
```


#### Generation of delta files for all the locales:

1. To generate delta , run one of the following:

   - For multiple excel sheets for each language:
    
   ```
   python delta_generator.py -i ./../../crowdsource-fe/public/locales -o ./delta_out -a --output-type SEPARATE_SHEETS
   ```
         
   - For all keys, but specific languages on a single excel sheet:
   ```
   python delta_generator.py -i ./../../crowdsource-fe/public/locales -o ./delta_out -l gu pa --all-keys --output-type SINGLE_SHEET
   ```
   
   - For all keys, all languages on a single excel sheet:
   
   ```
   python delta_generator.py -i ./../../crowdsource-fe/public/locales -o ./delta_out -a --all-keys --output-type SINGLE_SHEET
   ```
   
2. This will provide `out-meta` folder and `out-sme` folder inside /delta_out. Copy these to another location for later use(** Mandatory **).
3. The excel files in out-sme can be shared with others to collect translations.

#### Generation of locale files from the received translation excel files:

1. Put the translation excel files received from sme's in the following directory structure for each language as input:
    ```
    translation_excel_files/<language code>/<excel_file_name>.xlsx  (eg: input_excel_files/hi/delta_24thJune.xlsx )
    ```
2. Make sure you have the corresponding meta files in `out-meta` folder generated in the delta generation process.
3. To generate locale json files , run one of the following:

   - For specific languages taking single translation file that has all languages as input:
   ```
   python locale_generator.py -j ./../../crowdsource-fe/public/locales 
                               -e <input_translation_filename>.xlsx 
                               -m <translation_meta_filename> 
                               -o ./locale_output 
                               -t combined
                               -l gu pa
   ```
            
   - For specific languages taking separate translation files for each language as input:
   ```
   python locale_generator.py -j ./../../crowdsource-fe/public/locales 
                                   -e ./translation_excel_files 
                                   -m ./translation_meta_files 
                                   -o ./locale_output 
                                   -t separate
                                   -l gu pa
   ``` 

   - For all languages taking single translation file that has all languages as input:
   ```
   python locale_generator.py -j ./../../crowdsource-fe/public/locales 
                                   -e <input_translation_filename>.xlsx 
                                   -m <translation_meta_filename>
                                   -o ./locale_output 
                                   -t combined
                                   -a
   ```
                                               
   - For all languages taking separate translation files for each language as input:
   ```
   python locale_generator.py -j ./../../crowdsource-fe/public/locales 
                                   -e ./translation_excel_files 
                                   -m ./translation_meta_files 
                                   -o ./locale_output 
                                   -t separate
                                   -a
   ```
4. This will provide locale json files in output folder mentioned in the command.

#### Mapping Sheet contents with code:
If the excel sheet needs to have content on a specific format slightly different from the text content present in code, one can specify in [this](resources/sheet_mapping.json) file what needs to be replaced.

```
Eg:
  <key-name>: {
    "replacements": {
      <text-to-be-present-in-excel-sheet>: <corresponding-text-present-in-code>
    }
  },
```
This file is used to map contents between the sheet and code.
