# Test TTS-Initiative

tags: component

* Open Website
* Select "Speech Validation" from header

## Check Home Page
* Validate Speech Validation content
* User should see the top Language graph and other stats

## Validate Transcribe card should be enabled when the data is not contributed for Odia language
* User should store the progress bar for "Speech Validation"
* Select Contribution Language as "ଓଡିଆ"
* Navigate to "Transcribe" and add username "T User" then click Lets go
* When user clicks on Play button, Pause button should appear and when user clicks on pause, play should appear
* When User clicks on "Add Text" field and type "ହାଏ ଓଡିଆ ଓଡିଆ" submit and cancel button should be enabled
* When user clicks on submit button user should see " Thank you for contributing!"
* User clicks on Play button, and then on pause button, then clicks on "Add Text" field and type "ହାଏ ଓଡିଆ ଓଡିଆ,", then resume, submit button should be disabled
* When User clicks on "Add Text" field and type "ହାଏ ଓଡିଆ ଓଡିଆ" submit and cancel button should be enabled
* When user clicks on submit button for Odia language user should see "Thank you for contributing!"
* When user clicks on Speech Validation breadcrumb, user should land on Speech Validation home page

## Validate Transcribe flow
* Select Contribution Language as "ಕನ್ನಡ"
* Change user name to "T User"
* Navigate to "Transcribe" card
* When user clicks on the Test Speaker button, user should see "speakerbtn"
* When user clicks on the cross button , pop up should close and user should see the Test Mic and speaker button
* When user clicks on Play button, Pause button should appear and when user clicks on pause, play should visible
* User clears "Add Text" field should disable the buttons again
* When User clicks on "Add Text" field and type "Hello Hello" submit should be disabled and cancel button should be enabled
* User should see an error message "Please type in your chosen language"
* User clears "Add Text" field should disable the buttons again
* User clicks on play button
* When User clicks on "Add Text" field and type "ನೀವು ಹೇಗಿದ್ದೀರಿ" submit and cancel button should be enabled
* When user clicks on submit button user should see " Thank you for contributing!"
* When user clicks on Play button, Pause button should appear and when user clicks on pause, play should appear
* When User clicks on "Add Text" field and type "ನೀವು ಹೇಗಿದ್ದೀರಿ2" submit and cancel button should be enabled
* When user clicks on submit button user should see " Thank you for contributing!"
* When user skips the rest of the "3" sentences , User should see Thank you Page
* Click "Contribute More" Button
* When user skips the rest of the "1" sentences , User should see Thank you Page
* Validate Thank you page content for Speech Validation
* When user clicks on Contribute more button , user should see no data available message for "Speech Validation"

## Validate Validate flow
* Select Contribution Language as "ಕನ್ನಡ"
* Change user name to "V User"
* Navigate to "Validate" card
* "Skip" button should be enabled
* "Correct" button should be disabled
* "Needs Change" button should be disabled
* User plays the audio , "Needs Change" should be enabled & "Correct" should be disabled
* Click "Correct" Button
* "Correct" button should be disabled
* "Needs Change" button should be disabled
* User plays the audio , "Needs Change" should be enabled & "Correct" should be disabled
* User clicks on  "Needs Change" button user should see "Original Text" and "Your Edit" , "Cancel" should be  enabled
* When User clicks on "Your Edit" field and type "Hello" submit should be disabled and cancel button should be enabled
* User should see an error message "Please type in your chosen language"
* User clears "Your Edit" field should disable the buttons again in validation
* When User clicks on "Your Edit" field and type "ಗಹಹಜಲಲ" submit and cancel button should be enabled
* User skips the next "4" sentences user should land on Thank you page
* When user clicks on Validate more button , user should see no data available message for "Speech Validation"

## Check the Validate flow for new user
* Select Contribution Language as "ಕನ್ನಡ"
* Change user name to "New V User"
* Navigate to "Validate" card
* "Skip" button should be enabled
* "Correct" button should be disabled
* "Needs Change" button should be disabled
* User plays the audio , "Needs Change" should be enabled & "Correct" should be disabled
* Click "Correct" Button
* "Correct" button should be disabled
* "Needs Change" button should be disabled
* User clicks on Play button, and then on pause button, then clicks on "Needs Change", then clicks on "Your Edit" field and type "ಕನ್ನಡ ಕನ್ನಡ ಕನ್ನಡ,", then resume, submit button should be disabled, then skip
* User plays the audio , "Needs Change" should be enabled & "Correct" should be disabled
* User clicks on  "Needs Change" button user should see "Original Text" and "Your Edit" , "Cancel" should be  enabled
* When User clicks on "Your Edit" field and type "ಗಹಹಜಲಲ" submit and cancel button should be enabled
* User skips the next "3" sentences user should land on Thank you page
* User should see the "Validate More" button
* Navigate to "Know more" button and click "Know more" button
* "Validate 5 sentences in Kannada and earn Speech Validation Bronze Brand Contributor badge" text exists on page
* When user clicks on back button, user should land on Crowdsourcing home page

## Check Dashboard Page
* When user clicks on View all Details buttton user should be able to see "Progress Chart" , "Geographical Distribution"
* user should be able to see "People participated" , "Duration transcribed" , "Duration validated" , "Languages"
* When user select "ಕನ್ನಡ" Language from dropdown then "Languages" should not visible
* When user clicks on Speech Validation breadcrumb, user should land on Speech Validation home page

## Validate My Badge flow and check Badges
* Change user name to "Badge User"
* Select MyBadges from the dropdown
* "Congratulations" text should be visible
* "Badge User" text should be visible
* when user navigates to "ocr-tab" tab user should see badges
* when user navigates to "asr-tab" tab user should see badges
* when user navigates to "parallel-tab" tab user should see badges
* When user clicks on back button, user should land on Crowdsourcing home page
