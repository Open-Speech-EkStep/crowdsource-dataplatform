const {CURRENT_MODULE,MODULE} = require('./constants.js');
/**
 * 
 * @param {component_value} value - example Bolo/Suno/Dekho/Likho
 * will check from which component the feedback form is called and populate the feedback form.
 * 
 * @TODO test this function 
 */

const checkGivingFeedbackFor = () => {
        const currentModule = localStorage.getItem(CURRENT_MODULE);
        document.querySelectorAll('input[name="feedbackRadio"]').forEach((component) => {
            console.log(MODULE[currentModule].value)
            if(component.value === MODULE[currentModule].value)
            {
                component.checked = true;
            }
        });
}

module.exports = {
    checkGivingFeedbackFor
}