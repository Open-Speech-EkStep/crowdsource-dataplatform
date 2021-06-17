To run functional tests, do the following: 

1. To install gauge , use `brew install gauge` .
2. Navigate to functional_tests folder using `cd functional_tests`.
3. To feed data for tests, run the `sql/dataSeed.sql` file in respective db.
4. Run using the command, `gauge run specs/ --env dev` in default headless mode on dev environment.
(Note: You can change environment by replacing --env value.)
5. To run specific spec file, `gauge run specs/<SPEC-FILE> --env dev`
6. To run all specs parallely, `gauge run specs/ --env dev -p`.
7. To run with headless mode off, in `tests/Boloindia_step.js` file `const headless = process.env.headless_chrome.toLowerCase() === 'true';`, replace true with false.

Note: All environment related properties are in the `functional_tests/env` folder.