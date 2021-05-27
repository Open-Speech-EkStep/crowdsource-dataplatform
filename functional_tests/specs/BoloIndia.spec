# Test BoloIndia

* Open BoloIndia

## Validate Validator flow
* Select Contribution Language as "हिंदी" first time
//* Select translation language as "हिंदी"
* Navigate to "Validate" button and click "Validate" button
//* And User enter random Username and selects Age , Mother tongue ,gender
* Add "New" Username for Valiadtion
//* When user click on Lets Go Button, user should "not" see instructions to record
* When user click on Lets Go Button for Validate, user should "not" see instructions to record
* "skip_button" should be enabled , "dislike_button" "like_button" buttons should be disabled
* User plays the audio , "dislike_button","like_button" should be enabled
* User clicks on "dislike_button" , he should see next sentence and "dislike_button" "like_button" buttons should be disabled
* User skips the next "4" sentences user should land on Thank you page in ""
//* User skips the next "4" sentences user should land on Thank you page in "Hindi"
//* User should see the "अधिक प्रमाणित करें" button
* User should see the "Validate More" button

## Validate Contributor flow
//* Select translation language as "English"
* Navigate to "Contribute" button and click "Contribute" button
* And User enter random Username and selects Age , Mother tongue ,gender
* When user click on Lets Go Button, user should "" see instructions to record
* User should be able to close the Instructions , user should see a sentence , Skip button , Start Recording Button , username,Test Mic and speaker button
* When user clicks on the Test Microphone Speaker button, user should see "play-speaker" and "test-mic-button" buttons
* When user clicks on the cross button , pop up should close and user should see the Test Mic and speaker button
* When user clicks on "Start Recording" button, "Stop Recording" button should appear
* When user clicks on "Stop Recording" button, "Re-record" button should appear
* When user clicks on "Re-record" button, "Stop Recording" button should appear
* When user clicks on "Stop Recording" button, "Submit" button should appear
* When user clicks on "Submit" button, "Skip" button should appear
* When user skips all the rest of the "4" sentences , User should see Thank you Page
* when user clicks on the Contribute More button, user should not see the Instructions page again

## Validate the Speaker Details pop-up in Contribute section
//* Select translation language as "English"
* Navigate to "Contribute" button and click "Contribute" button
* Username field, Mother Tongue dropdown ,Age drop down , Gender Radio buttons should be present
* if a user enter username and click on Not you change user button , the field should be cleared
* If user selects Other as gender, some more gender options should be visible
* Speaker details popup should appear and close button should close the pop up

## Check Dashboard Page
//* Select translation language as "English"
* When user clicks on View all Details buttton , user shall land on Dashboard page
* user should be able to see "Progress Chart" , "Gender Distribution" , "State Wise distribution" , "Age Group Distribution"
* When user select "हिंदी" Language from dropdown then "languages contributed" should not visible

## Validate Feedback Page
* When user clicks on the Feedback link in the footer , user should land on the feedback page
* Submit button should be disbaled ,When user enters the subject and  Description submit button should be enabled
* when user clicks on the submit button , user should land on the Thank you page 
* When user clicks on the go to home page button , user should see the home page

## Validate Report feature
//* Select translation language as "English"
* Navigate to "Contribute" button and click "Contribute" button
* And User enter random Username and selects Age , Mother tongue ,gender
* When user click on Lets Go Button, user should "" see instructions to record
* When user clicks on Report Button, user should see Report Content Dialog Box & Submit button should be disabled
* Once user clicks on Others Radio button, Submit button should be enabled
* When user submits , Thank you pop up should come & close button should close the pop up

## Check About Us Page
* Navigate to "About Us" button and click "About Us" button
* Validate about us content
* Start Recording button is disabled
* Select Language "Hindi" enables the Start Recording button

//## Validate Locale content on Home Page
//* Select translation language as "हिंदी"
//* User should see the content in "Hindi"
//* User should see State Wise distribution and Top Languages