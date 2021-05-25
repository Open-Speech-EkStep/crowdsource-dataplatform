# Test DekhoIndia

* Open BoloIndia

## Check Dekho India Home Page
* Select "Dekho India"from header
* Validate Dekho India content
* User should see the top Language graph and other stats for Dekho India

## Validate both Label & Validate cards should be disabled when there is no data for Malayalam language
* Select "Dekho India"from header
* Select Contribution Language as "മലയാളം"
* Check "Label" option should be "disabled" on Home page
* Check "Validate" option should be "disabled" on Home page

## Validate Label card should be disabled & Validate should be enabled when the data is already contributed for Telugu language
* Select "Dekho India"from header 
* Select Contribution Language as "తెలుగు"
* Check "Label" option should be "disabled" on Home page
* Check "Validate" option should be "enabled" on Home page

## Check Dashboard Page
* Select "Dekho India"from header    
* When user clicks on View all Details buttton user should be able to see "Progress Chart" , "State Wise distribution"
* user should be able to see "People participated" , "Images labelled" , "Text validated" , "Languages"
* When user select "हिंदी" Language from dropdown then "languages" should not visible
* When user clicks on back button, user should land on Dekho India home page

## Validate the User Details pop-up in Label section for Kannada language
* Select "Dekho India"from header 
* Select Contribution Language as "ಕನ್ನಡ"
* Navigate to "Label" button and click "Label" button
* Username field should be present
* if a user enter username and click on Not you change user button , the field should be cleared
* Close button should close the pop up and user should see Dekho India Home page


## Validate the User Details pop-up in Validate section
* Select "Dekho India"from header    
* Navigate to "Validate" button and click "Validate" button
* Username field should be present
* if a user enter username and click on Not you change user button , the field should be cleared
* Close button should close the pop up and user should see Dekho India Home page

## Validate Label card should be enabled when the data is not contributed for Odia language
* Select "Dekho India"from header 
* Select Contribution Language as "ଓଡିଆ"
* Check "Label" option should be "enabled" on Home page
* Check "Validate" option should be "disabled" on Home page
* Navigate to "Label" button and click "Label" button
* Add "T User" Username
* When user click on Lets Go Button, user should "not" see instructions to record
* User click on "edit" field and type "ବନମବନମହଜ" submit and cancel button should be enabled
* User clears the edit field should disable the buttons again
* User click on "edit" field and type "ବନମବନମହଜ" submit and cancel button should be enabled
* When user clicks on submit button user should see " Thank you for contributing!"
* User click on "edit" field and type "ବନମବନମହଜ" submit and cancel button should be enabled
* When user clicks on submit button user should see " Thank you for contributing!"
* When user clicks on back button, user should land on Dekho India home page
* Check "Validate" option should be "enabled" on Home page
* Navigate to "Validate" button and click "Validate" button
* Add "V1 User" Username
* When user click on Lets Go Button, user should "not" see instructions to record
* "skip_button" should be enabled , "like_button" "need_change" buttons should be enabled
* User should see the text "Is the text from the image captured correctly?"
* User skips the next "2" sentences user should land on Thank you page in "English"

## Validate once user have skipped all sentences the same user should not be able to validate sentences again
* Select "Dekho India"from header 
* Navigate to "Validate" button and click "Validate" button
* Add "V1 User" Username
* When user click on Lets Go Button, user should "not" see instructions to record
* User should see no data available message

## Validate Label flow
* Select "Dekho India"from header    
* Select Contribution Language as "ಕನ್ನಡ"
* Navigate to "Label" button and click "Label" button
* Add "T User" Username
* When user click on Lets Go Button, user should "not" see instructions to record
* When User clicks on "edit" field and type "ನೀವು ಹೇಗಿದ್ದೀರಿ" submit and cancel button should be enabled
* When user clicks on submit button user should see " Thank you for contributing!"
* When User clicks on "edit" field and type "ನೀವು ಹೇಗಿದ್ದೀರಿ" submit and cancel button should be enabled
* When user clicks on submit button user should see " Thank you for contributing!"
* When user skips the rest of the "3" sentences , User should see Thank you Page
* when user clicks on the Contribute More button, user should not see the Instructions page again
* When user skips the rest of the "1" sentences , User should see Thank you Page
* When user clicks on Contribute more button , user should see no data available message for dekho India

## Validate Validate flow
* Select "Dekho India"from header 
* Navigate to "Validate" button and click "Validate" button
* Add "V User" Username
* When user click on Lets Go Button, user should "not" see instructions to record
* "skip_button" should be enabled , "like_button" "need_change" buttons should be enabled
* User clicks on "like_button" , he should see next sentence and "need_change" "like_button" buttons should be enabled
* User clicks on  "need_change" button user should see "Captured Text" and "Your Edit" , "cancel-edit-button" should be  enabled
* User click on "edit" field "submit-edit-button" should be enabled
//* user should see the Virtual Keyboard button
* User skips the next "4" sentences user should land on Thank you page in "English"
* User should see the "Validate More" button
* when user clicks on the Validate more button user should no data available message

## Check the Validate flow for new user . New user should see the sentences to validate
* Select "Dekho India"from header 
* Navigate to "Validate" button and click "Validate" button
* Add "New V User" Username
* When user click on Lets Go Button, user should "not" see instructions to record
* "skip_button" should be enabled , "like_button" "need_change" buttons should be enabled
* User clicks on "like_button" , he should see next sentence and "need_change" "like_button" buttons should be enabled
* User clicks on "like_button" , he should see next sentence and "need_change" "like_button" buttons should be enabled
* User clicks on "like_button" , he should see next sentence and "need_change" "like_button" buttons should be enabled
* User clicks on "like_button" , he should see next sentence and "need_change" "like_button" buttons should be enabled
* User clicks on "like_button" he should see thank you page and should be able to see bronze Badge
* User should see the "Validate More" button