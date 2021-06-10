# Test LikhoIndia

* Open Website
* Select "Likho India" from header

## Check Likho India Home Page
* Validate Likho India content
* User should see the top Language graph and other stats for Likho India

## Check Dashboard Page
* When user clicks on View all Details buttton user should be able to see "Progress Chart" , "State Wise distribution"
* user should be able to see "Language pairs" , "People participated" , "Translations done" , "Translations validated"
* Select "English" Language from "from-dash-language"
* Select "বাংলা" Language from "to-dash-language"
* "Language pairs" should not visible
* When user clicks on back button, user should land on Likho India home page

## Validate the User Details pop-up in Translate section for Odia language
* Select "ଓଡିଆ" Language from "from-language"
* Select "English" Language from "to-language"
* Navigate to "Translate" button and click "Translate" button
* Username field should be present
* if a user enter username and click on Not you change user button , the field should be cleared
* Close button should close the pop up and user should see Likho India Home page

## Validate the User Details pop-up in Validate section
* Select "English" Language from "from-language"
* Select "हिंदी" Language from "to-language"
* Navigate to "Validate" button and click "Validate" button
* Username field should be present
* if a user enter username and click on Not you change user button , the field should be cleared
* Close button should close the pop up and user should see Likho India Home page

## Validate Translate card should be enabled when the data is not contributed for Odia language
* Select "ଓଡିଆ" Language from "from-language"
* Select "English" Language from "to-language"
* Navigate to "Translate" button and click "Translate" button
* Add "T User" Username
* When user click on Lets Go Button, user should "not" see instructions to record
* "skip_button" should be enabled , "cancel-edit-button" "submit-edit-button" buttons should be disabled
* User should see add extension and watch video link
* When User clicks on "edit" field and type "Hello" submit and cancel button should be enabled
* User clears the edit field should disable the buttons again
* User should see an error message "Input Field can not be empty"
//* When User clicks on "edit" field and type "ବନମବନମହଜ" submit should be disabled and cancel button should be enabled
//* User should see an error message "Please type in your chosen language"
//* User clears the edit field should disable the buttons again
* User click on "edit" field and type "Unity is Strength" submit and cancel button should be enabled
* When user clicks on submit button user should see " Thank you for contributing!"
* User click on "edit" field and type "Be together always" submit and cancel button should be enabled
* When user clicks on submit button user should see " Thank you for contributing!"
* When user clicks on back button, user should land on Likho India home page
* Check "Validate" option should be "enabled" on Home page
* Navigate to "Validate" button and click "Validate" button
* Add "V1 User" Username
* When user click on Lets Go Button, user should "not" see instructions to record
* "skip_button" should be enabled , "like_button" "need_change" buttons should be enabled
* User should see the text "Is the translation correct?"
* User skips the next "2" sentences user should land on Thank you page in "English"

## Validate once user have skipped all sentences the same user should not be able to validate sentences again
* Navigate to "Validate" button and click "Validate" button
* Add "V1 User" Username
* When user click on Lets Go Button, user should "not" see instructions to record
* User should see no data available message for Likho India

//## Validate Translate flow
//* Navigate to "Translate" button and click "Translate" button
//* Add "T User" Username
//* When user click on Lets Go Button, user should "not" see instructions to record
//* "skip_button" should be enabled , "cancel-edit-button" "submit-edit-button" buttons should be disabled
//* When User clicks on "edit" field and type "All is well" submit and cancel button should be enabled
//* When user clicks on submit button user should see " Thank you for contributing!"
//* When User clicks on "edit" field and type "ବନମବନମହଜ" submit should be disabled and cancel button should be enabled
//* User should see an error message "Please type in your chosen language"
//* When user skips the rest of the "4" sentences , User should see Thank you Page
//* when user clicks on the Contribute More button, user should not see the Instructions page again
//* When user skips the rest of the "1" sentences , User should see Thank you Page
//* Validate Thank you page content for Likho India
//* When user clicks on Contribute more button , user should see no data available message for Likho India
//
//
//## Validate Validate flow
//* Navigate to "Validate" button and click "Validate" button
//* Add "V User" Username
//* When user click on Lets Go Button, user should "not" see instructions to record
//* User should see add extension and watch video link
//* Clicking watch video link should open video
//* "skip_button" should be enabled , "like_button" "need_change" buttons should be enabled
//* User clicks on "like_button" , he should see next sentence and "need_change" "like_button" buttons should be enabled
//* User clicks on  "need_change" button user should see "" and "Your Edit" , "cancel-edit-button" should be  enabled
//* When User clicks on "edit" field and type "Be positive" submit and cancel button should be enabled
//* When user clicks on submit button user should see " Thank you for contributing!"
//* User clicks on  "need_change" button user should see "" and "Your Edit" , "cancel-edit-button" should be  enabled
//* When User clicks on "edit" field and type "एकता शक्ति है" submit should be disabled and cancel button should be enabled
//* User should see an error message "Please type in your chosen language"
////* user should see the Virtual Keyboard button
//* User skips the next "5" sentences user should land on Thank you page in "English"
//* User should see the "Validate More" button
//* when user clicks on the Validate more button user should no data available message for Likho
//
//## Check the Validate flow for new user . New user should see the sentences to validate
//* Navigate to "Validate" button and click "Validate" button
//* Add "New V User" Username
//* When user click on Lets Go Button, user should "not" see instructions to record
//* "skip_button" should be enabled , "like_button" "need_change" buttons should be enabled
//* User clicks on "like_button" , he should see next sentence and "need_change" "like_button" buttons should be enabled
//* User clicks on "like_button" , he should see next sentence and "need_change" "like_button" buttons should be enabled
//* User clicks on "like_button" , he should see next sentence and "need_change" "like_button" buttons should be enabled
//* User clicks on "like_button" , he should see next sentence and "need_change" "like_button" buttons should be enabled
//* User clicks on "like_button" he should see thank you page and should be able to see bronze Badge
//* User should see the "Validate More" button
