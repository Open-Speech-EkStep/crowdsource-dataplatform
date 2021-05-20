/**
 * 
 * @param {component_value} value - example Bolo/Suno/Dekho/Likho
 * will check from which component the feedback form is called and populate the feedback form.
 * 
 * @TODO test this function 
 */
const checkGivingFeedbackFor = (value) => {
    document.querySelectorAll('input[name="feedbackRadio"]').forEach((component) => {
        if(component.value === value)
        {
            component.checked = true;
        }
    });
}


module.exports = {
    checkGivingFeedbackFor
}