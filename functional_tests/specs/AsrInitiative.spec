# Test ASR-Initiative
Tags: component

* Open Website
* Select "ASR Initiative" from header

## Validate the Speaker Details pop-up
* Select Contribution Language as "हिंदी"
* Navigate to "Contribute" card
* Username field, Mother Tongue dropdown ,Age drop down , Gender Radio buttons should be present
* if a user enter username and click on Not you change user button , the field should be cleared
* If user selects Other as gender, some more gender options should be visible
* User details popup should appear and close button should close the pop up

## Validate Contributor flow
* Select Contribution Language as "ଓଡିଆ"
* Navigate to "Contribute" card
* And User enter random Username and selects Age , Mother tongue ,gender
* When user click on Lets Go Button, user should "" see instructions to record
* User should be able to close the Instructions , user should see a sentence , Skip button , Start Recording Button , username,Test Mic and speaker button
* When user clicks on the Test Microphone Speaker button, user should see "speakerbtn" and "testMicButton" buttons
* When user clicks on the cross button , pop up should close and user should see the Test Mic and speaker button
* When user click on Tips Button, user should see instructions to record
* When user clicks on "Start Recording" button, "Stop Recording" button should appear
* When user clicks on "Stop Recording" button, "Re-record" button should appear
* When user clicks on "Re-record" button, "Stop Recording" button should appear
* When user clicks on "Stop Recording" button, "Submit" button should appear
* When user clicks on "Submit" button, "Skip" button should appear

## Validate Contributor flow Thank you page
* Change user name to "Dummy User1"
* Navigate to "Contribute" card
* user should "" see instructions to record
* When user skips all the rest of the "5" sentences , User should see Thank you Page
* Validate Thank you page content for ASR Initiative
* when user clicks on the Contribute More button, user should not see the Instructions page again

## Validate Validator flow
* Change user name to "Validate User"
* Navigate to "Validate" card
* user should "not" see instructions to record
* "Skip" should be enabled , "Incorrect" "Correct" buttons should be disabled
* User plays the audio , "Incorrect","Correct" should be disabled
* User clicks on "Incorrect" , he should see next sentence and "Incorrect" "Correct" buttons should be disabled
* User skips the next "4" sentences user should land on Thank you page
* User should see the "Validate More" button

## Check Dashboard Page
* When user clicks on View all Details buttton , user shall land on Dashboard page
* user should be able to see "Progress Chart" , "Gender Distribution" , "Geographical Distribution" , "Age Group Distribution"
* When user select "हिंदी" Language from dropdown then "Languages" should not visible

## Validate Feedback Page
* When user clicks on the Feedback icon, user should see the feedback popup
* Submit button should be disbaled, When user selects an opinion, submit button should be enabled
* when user clicks on the submit button , user should see thankyou popup 
* When user clicks on the close button , user should see the home page

## Validate Report feature
* Navigate to "Contribute" card
* And User enter random Username and selects Age , Mother tongue ,gender
* user should "" see instructions to record
* When user clicks on Report Button, user should see Report Content Dialog Box & Submit button should be disabled
* Once user clicks on Others Radio button, Submit button should be enabled
* When user submits , Thank you pop up should come & close button should close the pop up

## Validate Home page content
* Validate ASR Initiative content

## Check Terms and Condition links from Footer
* Click "Terms & Conditions" link
* Validate terms and condition content