## Auto Validation
Auto Validation feature validates and warns the users in case their inputs are detected to be different from what actual data should be. It is done by comparing the user input to a machine generated output and validated against a set threshold limit for every initiative. When Auto Validation is enabled for the application, user inputs during the validation are screened depending upon the [threshold](src/constants/constants.ts) set for each language in their respective initiatives.

For each initiatives, scores are calculated with user input and the machine generated output. If the scores do not pass the required threshold, the system displays a message on the application screen asking the user to double check their input. In case the users go ahead and submit their input despite the message, the response input is flagged and not validated further. 

* Types of scores calculated for initiatives:
  * ASR - WER (Word Error Rate)
  * OCR - Levenstein method
  * Parallel - BleuScore method

The Text Initiative currently does not support auto validation feature.
