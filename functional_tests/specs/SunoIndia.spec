# Test SunoIndia

* Open BoloIndia

## Check Home Page
* Select Contribution Language as "English"
* Select "Suno India"from header 
* Validate Suno India content
* User should see the top Language graph and other stats

## Validate the User Details pop-up in Transcribe section
* Select "Suno India"from header 
* Select Contribution Language as "हिंदी"
* Navigate to "Transcribe" button and click "Transcribe" button
* Username field should be present
* if a user enter username and click on Not you change user button , the field should be cleared
* User details popup should appear and close button should close the pop up

## Validate Transcribe flow
* Select "Suno India"from header    
* Select Contribution Language as "हिंदी"
* Navigate to "Transcribe" button and click "Transcribe" button
* Add "T User" Username
* When user click on Lets Go Button, user should "" see instructions to record
* User should be able to close the Instructions , user should see Skip button , Play Button , username , Cancel , Submit and speaker button
* When user clicks on the Test Speaker button, user should see "play-speaker"
* When user clicks on the cross button , pop up should close and user should see the Test Mic and speaker button
* When user clicks on Play button, Pause button should appear and when user clicks on pause, replay should appear
* User click on "edit" field and type "नमस्कार" submit and cancel button should be enabled
* When user clicks on submit button user should see " Thank you for contributing!"
* When user skips the rest of the "4" sentences , User should see Thank you Page

## Validate the User Details pop-up in Correct section
* Select "Suno India"from header    
* Select Contribution Language as "हिंदी"
* Navigate to "Correct" button and click "Correct" button
* Username field should be present
* if a user enter username and click on Not you change user button , the field should be cleared
* User details popup should appear and close button should close the pop up

## Validate Validate flow
* Select "Suno India"from header 
* Navigate to "Correct" button and click "Correct" button
* Add "V User" Username
* When user click on Lets Go Button, user should "not" see instructions to record
* "skip_button" should be enabled , "like_button" "need_change" buttons should be disabled
* User plays the audio , "need_change","like_button" should be enabled
* User clicks on "like_button" , he should see next sentence and "need_change" "like_button" buttons should be disabled
* User plays the audio , "need_change","like_button" should be enabled 
* User clicks on  "need_change" button user should see "Original Text" and "Your Edit" , "cancel-edit-button" should be  enabled
* User click on "edit" field "submit-edit-button" should be enabled
* user should see the Keyboard
* User skips the next "4" sentences user should land on Thank you page in "English"
* User should see the "Validate More" button

## Check Dashboard Page
* Select "Suno India"from header    
* When user clicks on View all Details buttton user should be able to see "Progress Chart" , "State Wise distribution"
* user should be able to see "People participated" , "Hrs transcribed" , "Hrs corrected" , "Languages"
* When user select "हिंदी" Language from dropdown then "languages" should not visible
* When user clicks on back button, user should land on home page

## Validate Report feature
* Select "Suno India"from header 
* Navigate to "Transcribe" button and click "Transcribe" button
* Add "Report User" Username
* When user click on Lets Go Button
* When user clicks on Report Button, user should see Report Content Dialog Box & Submit button should be disabled
* Once user clicks on Others Radio button in transcribe flow, Submit button should be enabled
* When user submits , Thank you pop up should come & close button should close the pop up