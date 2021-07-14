This utility allows users to generate excel file(with all keys / delta keys) from the locale files and repopulate the locale files with corrections and translations.

#### Summary:
    Step 1: Generate all keys into an excel file from the current locale json files and it can be shared for corrections/updations.
    Step 2: Using the updated excel file, new locale json files are created. This step involves cleaning of unused keys in other languages(except en).
    Step 3: From the newly created locale json files, delta is generated(along with metadata files). This files in out-sme can be shared for translations to be updated.
    Step 4: On receiving the excel files with translations, locale json files are updated with the respective translations.

#### Setup:

1. Run the following command to install python libraries:  `pip install -r requirements.txt`

#### All Keys excel file generation:

1. Run the following command: `cd all_keys_generator`
2. To generate from 'en' locale file, run from the following:
   ```
   python AllKeysExcelGenerator.py -j ./../../../crowdsource-ui/locales/en.json -o ./en/out/en.xlsx
   ```

(For more info on above command, use -h for help)
This `./en/out/en.xlsx` obtained from the above step will have all keys from en locale file and can be shared with people for corrections in values.

#### After correction is done:

1. Run the following command: `cd all_keys_generator`
2. Run the following command to repopulate the 'en' locale file and update all other locale files
   - To run with auto-generated excel from AllKeysExcelGenerator.py:
   ```
   python AllKeysJsonGenerator.py -i ./../../../crowdsource-ui/locales -e ./en/out/en.xlsx -o ./out/
   ```
   - To run with manually generated excel with the 4 categories('Suno India', 'Bolo India', 'Likho India', 'Dekho India'):
   ```
   python AllKeysJsonGenerator.py -i ./../../../crowdsource-ui/locales -e ./../test-data/read-data-from-table/English_content.xlsx  -o ./out/ -c manual
   ```

(For more info on above command, use -h for help)
In `./out/` folder all locale files are generated after the above command is ran. This will have all the updated corrections. This folder should be used in delta generation. 

#### Generation of delta files for all the locales:

1. Run the following command: `cd delta_generation`
2. To generate delta , run one of the following:

   - For specific languages:

   ```
   python DeltaGenerator.py -i ./../all_keys_generator/out -o . -l gu pa
   ```

   - For all languages:

   ```
   python DeltaGenerator.py -i ./../all_keys_generator/out -o . -a
   ```

   - To include all keys in delta:

   ```
   python DeltaGenerator.py -i ./../all_keys_generator/out -o . -a --all-keys
   ```
3. This will provide `out-meta` folder and `out-sme` folder. Copy these to another location for later use(** Mandatory **).
4. The excel files in out-sme can be shared with others to collect translations.

#### Generation of locale files from the received translation excel files:

1. Run the following command: `cd locale_generation`
2. Put the translation excel files received from sme's in the following directory structure for each language as input:
    ```
    input_excel_files/<language code>/<excel_file_name>.xlsx  (eg: input_excel_files/hi/delta_24thJune.xlsx )
    ```
3. Make sure you have the corresponding meta files in `out-meta` folder generated in the delta generation process.
4. To generate locale json files , run one of the following:

   - For specific languages:

   ```
   python LocaleGenerator.py -j ./../all_keys_generator/out -e ./input_excel_files -m ./../delta_generation/out-meta -o . -l gu pa
   ```

   - For all languages:

   ```
   python LocaleGenerator.py -j ./../all_keys_generator/out -e ./input_excel_files -m ./../delta_generation/out-meta -o . -a
   ```
5. This will provide locale json files in output folder mentioned in the command.

#### To clean the locale files of all languages(except en) with respect to keys in en locale file:

1. Run the following command: `cd clean_unused_keys`
2. Run the following command to clean:

   - For specific languages:

   ```
   python CleanLocaleJsons.py -i ./../../../crowdsource-ui/locales -o . -l gu pa
   ```
   - For all languages:

   ```
   python CleanLocaleJsons.py -i ./../../../crowdsource-ui/locales -o . -a 
   ```
3. This will give cleaned json files in the mentioned output folder.
