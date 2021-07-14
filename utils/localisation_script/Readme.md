This utility allows users to generate excel file(with all keys / delta keys) from the locale files and repopulate the locale files with corrections and translations.

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
   ```
       python AllKeysJsonGenerator.py -j ./../../../crowdsource-ui/locales/en.json -e ./en/out/en.xlsx -o ./out/
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
2. To generate locale json files , run one of the following:

   - For specific languages:

   ```
       python LocaleGenerator.py -j ./../all_keys_generator/out -e ./input_excel_files -m ./../delta_generation/out-meta -o . -l gu pa
   ```

   - For all languages:

   ```
       python LocaleGenerator.py -j ./../all_keys_generator/out -e ./input_excel_files -m ./../delta_generation/out-meta -o . -a
   ```
3. This will provide locale json files in output folder mentioned in the command.

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
