# Test SunoIndia

* Open BoloIndia

## Check Home Page
* Select "Suno India"from header 
* Validate Suno India content
* User should see the top Language graph and other stats

## Validate both the cards should be disabled when there is no data for Malayalam language
* Select "Suno India"from header 
* Select Contribution Language as "മലയാളം"
* Check "Transcribe" option should be "disabled" on Home page
* Check "Correct" option should be "disabled" on Home page

## Validate Transcribe card should be enabled when the data is not contributed for Odia language
* Select "Suno India"from header 
* Select Contribution Language as "ଓଡିଆ"
* Check "Transcribe" option should be "enabled" on Home page
* Check "Correct" option should be "disabled" on Home page
* Navigate to "Transcribe" button and click "Transcribe" button
* Add "T User" Username
//* When user click on Lets Go Button, user should "" see instructions to record
* When user click on Lets Go Button, user should "not" see instructions to record
* When user clicks on Play button, Pause button should appear and when user clicks on pause, resume should appear
* User click on "edit" field and type "ହାଏ ଓଡିଆ ଓଡିଆ" submit and cancel button should be enabled
* When user clicks on submit button user should see " Thank you for contributing!"
* When user clicks on Play button, Pause button should appear and when user clicks on pause, resume should appear
* User click on "edit" field and type "ହାଏ ଓଡିଆ ଓଡିଆ" submit and cancel button should be enabled
* When user clicks on submit button for Odia language user should see "Thank you for contributing!"
* When user clicks on back button, user should land on home page
* Check "Correct" option should be "enabled" on Home page
* Navigate to "Correct" button and click "Correct" button
* Add "V1 User" Username
* When user click on Lets Go Button, user should "not" see instructions to record for Dekho India flow
* "skip_button" should be enabled , "like_button" "need_change" buttons should be disabled
* User plays the audio , "need_change" should be enabled & "like_button" should be disabled

## Validate Transcribe card should be disabled & Validate should be enabled when the data is already contributed for Telugu language
* Select "Suno India"from header 
* Select Contribution Language as "తెలుగు"
* Check "Transcribe" option should be "disabled" on Home page
* Check "Correct" option should be "enabled" on Home page

## Check Dashboard Page
* Select "Suno India"from header    
* When user clicks on View all Details buttton user should be able to see "Progress Chart" , "State Wise distribution"
* user should be able to see "People participated" , "Hrs transcribed" , "Hrs validated" , "Languages"
* When user select "हिंदी" Language from dropdown then "languages" should not visible
* When user clicks on back button, user should land on home page

## Validate the User Details pop-up in Transcribe section for Kannada language
* Select "Suno India"from header 
* Select Contribution Language as "ಕನ್ನಡ"
* Navigate to "Transcribe" button and click "Transcribe" button
* Username field should be present
* if a user enter username and click on Not you change user button , the field should be cleared
* User details popup should appear and close button should close the pop up

## Validate Transcribe flow
* Select "Suno India"from header    
* Navigate to "Transcribe" button and click "Transcribe" button
* Add "T User" Username
//* When user click on Lets Go Button, user should "" see instructions to record
* When user click on Lets Go Button, user should "not" see instructions to record
//* User should be able to close the Instructions , user should see Skip button , Play Button , username , Cancel , Submit and speaker button
* When user clicks on the Test Speaker button, user should see "play-speaker"
* When user clicks on the cross button , pop up should close and user should see the Test Mic and speaker button
* When user clicks on Play button, Pause button should appear and when user clicks on pause, resume should appear
* When User clicks on "edit" field and type "ನೀವು ಹೇಗಿದ್ದೀರಿ" submit and cancel button should be enabled
* When user clicks on submit button user should see " Thank you for contributing!"
* When user clicks on Play button, Pause button should appear and when user clicks on pause, resume should appear
* When User clicks on "edit" field and type "ನೀವು ಹೇಗಿದ್ದೀರಿ" submit and cancel button should be enabled
* When user clicks on submit button user should see " Thank you for contributing!"
* When user skips the rest of the "3" sentences , User should see Thank you Page
* when user clicks on the Contribute More button, user should not see the Instructions page again
* When user skips the rest of the "1" sentences , User should see Thank you Page
* When user clicks on Contribute more button , user should see no data available message

## Validate the User Details pop-up in Correct section
* Select "Suno India"from header    
* Navigate to "Correct" button and click "Correct" button
* Username field should be present
* if a user enter username and click on Not you change user button , the field should be cleared
* User details popup should appear and close button should close the pop up

## Validate Validate flow
* Select "Suno India"from header 
* Navigate to "Correct" button and click "Correct" button
* Add "V User" Username
* When user click on Lets Go Button, user should "not" see instructions to record for Dekho India flow
* "skip_button" should be enabled , "like_button" "need_change" buttons should be disabled
* User plays the audio , "need_change" should be enabled & "like_button" should be disabled
* User clicks on "like_button" , he should see next sentence and "need_change" "like_button" buttons should be disabled
* User plays the audio , "need_change" should be enabled & "like_button" should be disabled
* User clicks on  "need_change" button user should see "Original Text" and "Your Edit" , "cancel-edit-button" should be  enabled
* User click on "edit" field "submit-edit-button" should be enabled
* User skips the next "4" sentences user should land on Thank you page in "English"
* User should see the "Validate More" button
* when user clicks on the Validate more button user should no data available message

## Check the Validate flow for new user
* Select "Suno India"from header 
* Navigate to "Correct" button and click "Correct" button
* Add "New V User" Username
* When user click on Lets Go Button, user should "not" see instructions to record for Dekho India flow
* "skip_button" should be enabled , "like_button" "need_change" buttons should be disabled
* User plays the audio , "need_change" should be enabled & "like_button" should be disabled
* User clicks on "like_button" , he should see next sentence and "need_change" "like_button" buttons should be disabled
* User plays the audio , "need_change" should be enabled & "like_button" should be disabled
* User clicks on  "need_change" button user should see "Original Text" and "Your Edit" , "cancel-edit-button" should be  enabled
* User click on "edit" field "submit-edit-button" should be enabled
* User skips the next "4" sentences user should land on Thank you page in "English"
* User should see the "Validate More" button