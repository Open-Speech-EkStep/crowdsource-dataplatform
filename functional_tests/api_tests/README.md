### Prerequisites:
Make sure you have npm and node installed.<br> 

### To install mocha, chai, supertest and mochawesome, follow these steps:
1. Navigate to api_tests folder using following command. <br> 
`cd functional_tests/api_tests`<br>
2. Run `npm install`<br> 

### To run API test, follow these steps:
1. Navigate to api_test folder using following command. <br> 
`cd functional_tests/api_tests`<br>
2. To run specific test file, execute the following command.<br>
`ENV=<env-name> npx mocha <TestFile_name>`<br>
E.g., `ENV=test npx mocha ./test/feedback.test.js`<br>
3. To run api test suite, execute the following command.<br>
`ENV=<env-name> npm run test`<br>
E.g., `ENV=test npm run test`<br>

Note: 
    - Environment related properties are in the `api_tests/config/config.js` file.<br>