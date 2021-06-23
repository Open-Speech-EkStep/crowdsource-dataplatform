# Test DekhoIndia
Tags: component

* Open Website
* Select "Dekho India" from header

## Check Dekho India Home Page
* Validate Dekho India content
* User should see the top Language graph and other stats for Dekho India

## Label & Validate cards should be disabled when there is no data for Malayalam /Label card should be disabled & Validate should be enabled when data is contributed for Telugu
* Select Contribution Language as "മലയാളം"
* Check "Label" option should be "disabled" on Home page
* Check "Validate" option should be "disabled" on Home page
* Select Contribution Language as "తెలుగు"
* Check "Label" option should be "disabled" on Home page
* Check "Validate" option should be "enabled" on Home page
* Check user details for "Validate" for "Dekho" India

## Validate Label card should be enabled when the data is not contributed for Odia language
* Select Contribution Language as "ଓଡିଆ"
* Check "Label" option should be "enabled" on Home page
* Check user details for "Label" for "Dekho" India
* Check "Validate" option should be "disabled" on Home page
* Navigate to "Label" and add username "T User" then click Lets go
* User should see add extension and watch video link
* Check Data Source button should not be visible
* User click on "edit" field and type "ବନମବନମହଜ2" submit and cancel button should be enabled
* User clears the edit field should disable the buttons again
* User click on "edit" field and type ";ବନମବନମହଜ" submit and cancel button should be enabled
* When user clicks on submit button user should see " Thank you for contributing!"
* User click on "edit" field and type "ବନମବନମହଜ" submit and cancel button should be enabled
* When user clicks on submit button user should see " Thank you for contributing!"
* When user clicks on back button, user should land on Dekho India home page
* Check "Validate" option should be "enabled" on Home page

## Validate Label flow
* Select Contribution Language as "ಕನ್ನಡ"
* Navigate to "Label" and add username "T User" then click Lets go
* When User clicks on "edit" field and type "ನೀವು ಹೇಗಿದ್ದೀರಿ;" submit and cancel button should be enabled
* When user clicks on submit button user should see " Thank you for contributing!"
* When User clicks on "edit" field and type "Hello Hello" submit should be disabled and cancel button should be enabled
* User should see an error message "Please type in your chosen language"
* User clears the edit field should disable the buttons again
* User should see an error message "Input field can not be empty"
* When User clicks on "edit" field and type "ನೀವು ಹೇಗಿದ್ದೀರಿ3" submit and cancel button should be enabled
* When user clicks on submit button user should see " Thank you for contributing!"
* When user skips the rest of the "3" sentences , User should see Thank you Page
* when user clicks on the Contribute More button, user should not see the Instructions page again
* When user skips the rest of the "1" sentences , User should see Thank you Page
* Validate Thank you page content for Dekho India
* When user clicks on Contribute more button , user should see no data available message for "Dekho" India

## Validate Validate flow
* Navigate to "Validate" and add username "V User" then click Lets go
* User should see add extension and watch video link
* Clicking watch video link should open video
* "skip_button" should be enabled , "like_button" "need_change" buttons should be enabled
* User clicks on "like_button" , he should see next sentence and "need_change" "like_button" buttons should be enabled
* User clicks on  "need_change" button user should see "Captured Text" and "Your Edit" , "cancel-edit-button" should be  enabled
* When User clicks on "edit" field and type "Hello" submit should be disabled and cancel button should be enabled
* User should see an error message "Please type in your chosen language"
* User clears the edit field should disable the buttons again in validation
* User should see an error message "Input field can not be empty"
* User click on "edit" field "submit-edit-button" should be enabled
* User skips the next "4" sentences user should land on Thank you page in "English"
* User should see the "Validate More" button
* When user clicks on Validate more button , user should see no data available message for "Dekho" India

## Check the Validate flow for new user . New user should see the sentences to validate
* Navigate to "Validate" and add username "New V User" then click Lets go
* "skip_button" should be enabled , "like_button" "need_change" buttons should be enabled
* User clicks on "like_button" , he should see next sentence and "need_change" "like_button" buttons should be enabled
* User clicks on "like_button" , he should see next sentence and "need_change" "like_button" buttons should be enabled
* User clicks on "like_button" , he should see next sentence and "need_change" "like_button" buttons should be enabled
* User clicks on "like_button" , he should see next sentence and "need_change" "like_button" buttons should be enabled
* User clicks on "like_button" he should see thank you page and should be able to see bronze Badge
* User should see the "Validate More" button

## Check Dashboard Page
* When user clicks on View all Details buttton user should be able to see "Progress Chart" , "State Wise distribution"
* user should be able to see "People participated" , "Images labelled" , "Images validated" , "Languages"
* When user select "ଓଡିଆ" Language from dropdown then "languages" should not visible
* When user clicks on back button, user should land on Dekho India home page

## Validate profanity configuration
* Select Contribution Language as "ગુજરાતી"
* Check "Transcribe" option should be "disabled" on Home page
* Check "Correct" option should be "disabled" on Home page

___
* User clicks back button
