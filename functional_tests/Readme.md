To run functional tests, do the following: 

1. To install gauge , use `brew install gauge` .
2. Navigate to functional_tests folder using `cd functional_tests`.
3. To feed data for tests, run the `sql/dataSeed.sql` file in respective db.
4. Run using the command, `gauge run specs/ --env <env-name>` in default headless mode on dev environment.
(Note: You can change environment by replacing --env value.)
5. To run specific spec file, `gauge run specs/<SPEC-FILE> --env <env-name>`
6. To run all specs parallely, `gauge run specs/ --env <env-name> -p`.
7. To run with headless mode off, in `tests/AsrInitiative.js` file `const headless = process.env.headless_chrome.toLowerCase() === 'true';`, replace true with false.

To run Galen tests, do the following:
    - Specify url in `layout_test/suites/constant.properties` on which env you want to run the tests.


Note: 
    - All environment related properties are in the `functional_tests/env` folder.
    - Supported envs: local, dev, prod, test