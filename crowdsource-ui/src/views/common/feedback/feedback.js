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

const updateOpinionSVGColor = () => {
    $(document).ready(() => {

        $('input[type="radio"] ').click(function(){
            var inputValue = $(this).attr("value");
            var targetBox = $("." + inputValue);
            $(".box").not(targetBox).hide();
            $(targetBox).show();
        });

        $(".opinion-label").mouseenter(function() {
            $(this).find("path, polygon, circle").attr("stroke", "#4ED738");
            $(this).find("path, polygon, circle").attr("fill", "#fff");
         });
        $(".opinion-label").mouseleave(function() {
            $(this).find("path, polygon, circle").attr("stroke", "#123122");
            $(this).find("path, polygon, circle").attr("fill", "#fff");
         });

    });
}

module.exports = {
    checkGivingFeedbackFor,
    updateOpinionSVGColor
}