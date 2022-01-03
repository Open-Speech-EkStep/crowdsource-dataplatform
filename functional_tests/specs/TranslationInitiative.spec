# Test Translation-Initiative
Tags: component

* Open Website
* Select "Translation Initiative" from header

## Check Translation Initiative Home Page
* Validate Translation Initiative content
* User should see the top Language graph and other stats for Translation Initiative

## Check Dashboard Page
* When user clicks on View all Details buttton user should be able to see "Progress Chart" , "Geographical Distribution"
* user should be able to see "Language pairs" , "People participated" , "Translations done" , "Translations validated"
* Select "English" Language from "SelectFromLanguage"
* Select "বাংলা" Language from "SelectToLanguage"
* "Language pairs" should not visible
* When user clicks on Translation Initiative breadcrumb, user should land on Translation Initiative home page

## Validate the User Details pop-up in Translate section for Odia language
* Select "ଓଡିଆ" Language from "SelectContributionLanguage"
* Select "English" Language from "SelectTranslatedLanguage"
* Navigate to "Translate" button and click "Translate" button
* Username field should be present
* if a user enter username and click on Not you change user button , the field should be cleared
* Close button should close the pop up and user should see Translation Initiative Home page

## Validate Translate card should be enabled when the data is not contributed for Odia language
* User should store the progress bar for "Translation Initiative"
* Select "ଓଡିଆ" Language from "SelectContributionLanguage"
* Select "English" Language from "SelectTranslatedLanguage"
* Navigate to "Translate" and add username "T User" then click Lets go
* User should see add extension and watch video link
* "Skip" button should be enabled
* "Cancel" button should be disabled
* "Submit" button should be disabled
* When User clicks on "English" field and type "Hello" submit and cancel button should be enabled
* User clears "English" field should disable the buttons again
* When User clicks on "English" field and type "ବନମବନମହଜ" submit should be disabled and cancel button should be enabled
* User should see an error message "Please type in your chosen language"
* User clears "English" field should disable the buttons again
* When User clicks on "English" field and type "Unity is Strength" submit and cancel button should be enabled
* When user clicks on submit button user should see " Thank you for contributing!"
* When User clicks on "English" field and type "Be together always" submit and cancel button should be enabled
* When user clicks on submit button user should see " Thank you for contributing!"
* When user clicks on Translation Initiative breadcrumb, user should land on Translation Initiative home page
* Change user name to "V User"
* Navigate to "Validate" card
* "Skip" button should be enabled
* "Correct" button should be enabled
* "Needs Change" button should be enabled
* User should see the text "Is the translation correct?"
* User skips all "2" sentences user should land on Translation Initiative Thank you page
* When user clicks on Validate more button , user should see no data available message for "Translation Initiative"

## Validate Validate flow
* Select "ଓଡିଆ" Language from "SelectContributionLanguage"
* Select "English" Language from "SelectTranslatedLanguage"
* Change user name to "V1 User"
* Navigate to "Validate" card
* User should see add extension and watch video link
* "Skip" button should be enabled
* "Correct" button should be enabled
* "Needs Change" button should be enabled
* User clicks on  "Needs Change" button user should see "" and "Your Edit" , "Cancel" should be  enabled
* When User clicks on "English" field and type "हिंदी" submit should be disabled and cancel button should be enabled
* User should see an error message "Please type in your chosen language"
* User clears "Your Edit" field should disable the buttons again in validation
* When User clicks on "English" field and type "Be positive" submit and cancel button should be enabled
* When user clicks on submit button user should see " Thank you for contributing!"

___
* User clicks back button
