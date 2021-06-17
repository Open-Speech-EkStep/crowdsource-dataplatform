# Test Likho India Profanity 

* Open Profanity Website for "Likho" India


## User not found flow
* User details popup should appear
* When User enter "abc123@gmail.com" Email and select prefered langauge as "Hindi"
* User should see the Alert for user not found
* When user click on Lets Go Button

## Invalid User flow
* User details popup should appear
* When User enter "testuser" Email and select prefered langauge as "Hindi"
* User should see the Alert for invalid user 
* When user click on Lets Go Button

## Validate Profanity flow
* User details popup should appear
* Email field, languge dropdown should be present
* When User enter "amulya.ahuja@thoughtworks.com" Email and select prefered langauge as "Hindi"
* When user click on Lets Go Button, user should see back button
* User should be able to see a textarea, text , Skip button, Progress bar, Not Profane Button , Profane button
* Not Profane Profane button should be enabled for dekho india
* User clicks on not profane "cancel-edit-button" , he should see next sentence and "cancel-edit-button" "submit-edit-button" buttons should be enabled
* User clicks on profane "submit-edit-button" , he should see next sentence and "cancel-edit-button" "submit-edit-button" buttons should be enabled
* User skips "skip_button" the next "18" sentences user should see Thank you popup
* User should see the "Contribute More" button
* When user clicks on "Contribute More" user should see the message "Please try again later."