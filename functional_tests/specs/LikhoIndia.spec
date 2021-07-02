# Test LikhoIndia
Tags: component

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

## Validate Translate card should be enabled when the data is not contributed for Odia language
* Select "ଓଡିଆ" Language from "from-language"
* Select "English" Language from "to-language"
* Navigate to "Translate" and add username "T User" then click Lets go
* "skip_button" should be enabled , "cancel-edit-button" "submit-edit-button" buttons should be disabled
* User should see add extension and watch video link
* When User clicks on "edit" field and type "Hello" submit and cancel button should be enabled
* User clears the edit field should disable the buttons again
* User should see an error message "Input Field can not be empty"
* When User clicks on "edit" field and type "ବନମବନମହଜ" submit should be disabled and cancel button should be enabled
* User should see an error message "Please type in your chosen language"
* User clears the edit field should disable the buttons again
* User click on "edit" field and type "Unity is Strength" submit and cancel button should be enabled
* When user clicks on submit button user should see " Thank you for contributing!"
* User click on "edit" field and type "Be together always" submit and cancel button should be enabled
* When user clicks on submit button user should see " Thank you for contributing!"
* When user clicks on back button, user should land on Likho India home page
* Check "Validate" option should be "enabled" on Home page
* Change user name to "V User"
* Navigate to "Validate"
* "skip_button" should be enabled , "like_button" "need_change" buttons should be enabled
* User should see the text "Is the translation correct?"
* User skips the next "2" sentences user should land on Thank you page in "English"
* When user clicks on Validate more button , user should see no data available message for "Likho" India

## Validate Validate flow
* Select "ଓଡିଆ" Language from "from-language"
* Select "English" Language from "to-language"
* Change user name to "V1 User"
* Navigate to "Validate"
* User should see add extension and watch video link
* "skip_button" should be enabled , "like_button" "need_change" buttons should be enabled
* User clicks on  "need_change" button user should see "" and "Your Edit" , "cancel-edit-button" should be  enabled
* When User clicks on "edit" field and type "हिंदी" submit should be disabled and cancel button should be enabled
* User should see an error message "Please type in your chosen language"
* User clears the edit field should disable the buttons again in validation
* User should see an error message "Input field can not be empty"
* When User clicks on "edit" field and type "Be positive" submit and cancel button should be enabled
* When user clicks on submit button user should see " Thank you for contributing!"

___
* User clicks back button
