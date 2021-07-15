# Test SunoIndia
Tags: component

* Open Website
* Select "suno_india_tab" from header

## Check Home Page
* Validate Suno India content
* User should see the top Language graph and other stats

## Both cards should be disabled when there is no data for Malayalam / Transcribe card is disabled & Validate is enabled when data is already contributed for Telugu
* Select Contribution Language as "മലയാളം"
* Check "Transcribe" option should be "disabled" on Home page
* Check "Validate" option should be "disabled" on Home page
* Select Contribution Language as "తెలుగు"
* Check "Transcribe" option should be "disabled" on Home page
* Check "Validate" option should be "enabled" on Home page

## Validate Transcribe card should be enabled when the data is not contributed for Odia language
* Select Contribution Language as "ଓଡିଆ"
* Check "Transcribe" option should be "enabled" on Home page
* Check "Validate" option should be "disabled" on Home page
* Navigate to "Transcribe" and add username "T User" then click Lets go
//* When user clicks on Data Source button, popup should open and they should see source information
* When user clicks on Play button, Pause button should appear and when user clicks on pause, resume should appear
* User click on "edit" field and type "ହାଏ ଓଡିଆ ଓଡିଆ" submit and cancel button should be enabled
* When user clicks on submit button user should see " Thank you for contributing!"
* User clicks on Play button, and then on pause button, then clicks on "edit" field and type "ହାଏ ଓଡିଆ ଓଡିଆ,", then resume, submit button should be disabled
* User click on "edit" field and type "ହାଏ ଓଡିଆ ଓଡିଆ" submit and cancel button should be enabled
* When user clicks on submit button for Odia language user should see "Thank you for contributing!"
* When user clicks on back button, user should land on home page
* Check "Validate" option should be "enabled" on Home page

## Validate Transcribe flow
* Select Contribution Language as "ಕನ್ನಡ"
* Change user name to "T User"
* Navigate to "Transcribe"
* When user clicks on the Test Speaker button, user should see "play-speaker"
* When user clicks on the cross button , pop up should close and user should see the Test Mic and speaker button
* When user clicks on Play button, Pause button should appear and when user clicks on pause, resume should visible
* When User clicks on "edit" field and type ";ನೀವು ಹೇಗಿದ್ದೀರಿ" submit should be disabled and cancel button should be enabled
* User should see an error message "Special characters are not allowed"
* User clears the edit field should disable the buttons again
* User should see an error message "Input Field can not be empty"
* When User clicks on "edit" field and type "Hello Hello" submit should be disabled and cancel button should be enabled
* User should see an error message "Please type in your chosen language"
* User clears the edit field should disable the buttons again
* User should see an error message "Input field can not be empty"
* User clicks on resume button
* When User clicks on "edit" field and type "ನೀವು ಹೇಗಿದ್ದೀರಿ" submit and cancel button should be enabled
* When user clicks on submit button user should see " Thank you for contributing!"
* When user clicks on Play button, Pause button should appear and when user clicks on pause, resume should appear
* When User clicks on "edit" field and type "ನೀವು ಹೇಗಿದ್ದೀರಿ2" submit and cancel button should be enabled
* When user clicks on submit button user should see " Thank you for contributing!"
* When user skips the rest of the "3" sentences , User should see Thank you Page
* when user clicks on the Contribute More button, user should not see the Instructions page again
* When user skips the rest of the "1" sentences , User should see Thank you Page
* Validate Thank you page content for Suno India
* When user clicks on Contribute more button , user should see no data available message for "Suno" India
* When user clicks on back button, user should land on home page

## Validate Validate flow
* Select Contribution Language as "ಕನ್ನಡ"
* Change user name to "V User"
* Navigate to "Validate"
* "skip_button" should be enabled , "like_button" "need_change" buttons should be disabled
* User plays the audio , "need_change" should be enabled & "like_button" should be disabled
* User clicks on "like_button" , he should see next sentence and "need_change" "like_button" buttons should be disabled
* User plays the audio , "need_change" should be enabled & "like_button" should be disabled
* User clicks on  "need_change" button user should see "Original Text" and "Your Edit" , "cancel-edit-button" should be  enabled
* When User clicks on "edit" field and type "Hello" submit should be disabled and cancel button should be enabled
* User should see an error message "Please type in your chosen language"
* User clears the edit field should disable the buttons again in validation
* User should see an error message "Input field can not be empty"
* When User clicks on "edit" field and type ";ನೀವು ಹೇಗಿದ್ದೀರಿ" submit should be disabled and cancel button should be enabled
* User should see an error message "Special characters are not allowed"
* User clears the edit field should disable the buttons again in validation
* User should see an error message "Input field can not be empty"
* User click on "edit" field "submit-edit-button" should be enabled
* User skips the next "4" sentences user should land on Thank you page in "English"
* User should see the "Validate More" button
* When user clicks on Validate more button , user should see no data available message for "Suno" India
* When user clicks on back button, user should land on home page

## Check the Validate flow for new user
* Select Contribution Language as "ಕನ್ನಡ"
* Change user name to "New V User"
* Navigate to "Validate"
* "skip_button" should be enabled , "like_button" "need_change" buttons should be disabled
* User plays the audio , "need_change" should be enabled & "like_button" should be disabled
* User clicks on "like_button" , he should see next sentence and "need_change" "like_button" buttons should be disabled
* User clicks on Play button, and then on pause button, then clicks on "need_change", then clicks on "edit" field and type "ಕನ್ನಡ ಕನ್ನಡ ಕನ್ನಡ,", then resume, submit button should be disabled, then skip
* User plays the audio , "need_change" should be enabled & "like_button" should be disabled
* User clicks on  "need_change" button user should see "Original Text" and "Your Edit" , "cancel-edit-button" should be  enabled
* User click on "edit" field "submit-edit-button" should be enabled
* User skips the next "3" sentences user should land on Thank you page in "English"
* User should see the "Validate More" button
* Navigate to "Know more" button and click "Know more" button
* should select "" tab, "Level", "Validations", "Badge", "Validating: 5 Images" text & "Bronze_validate","Silver_validate","Gold_validate","Platinum_validate" image exist by default
* When user clicks on back button, user should land on home page


## Check Dashboard Page
* When user clicks on View all Details buttton user should be able to see "Progress Chart" , "State Wise distribution"
* user should be able to see "People participated" , "Duration transcribed" , "Duration validated" , "Languages"
* When user select "ಕನ್ನಡ" Language from dropdown then "Languages" should not visible
* When user clicks on back button, user should land on home page

## Validate profanity configuration
* Select Contribution Language as "ગુજરાતી"
* Check "Transcribe" option should be "disabled" on Home page
* Check "Validate" option should be "disabled" on Home page


## Validate My Badge flow and check Badges
* Change user name to "Badge User"
* Select MyBadges from the dropdown
* "Congratulations" text should be visible
* "Badge User" text should be visible
* when user navigates to "dekho-tab" tab user should see badges 
* when user navigates to "suno-tab" tab user should see badges 
* when user navigates to "likho-tab" tab user should see badges 
* When user clicks on back button, user should land on Bhasha Daan home page