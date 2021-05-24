const {CURRENT_MODULE,MODULE} = require('./constants.js');

const checkGivingFeedbackFor = () => {
        const currentModule = localStorage.getItem(CURRENT_MODULE);
        document.querySelectorAll('input[name="feedbackRadio"]').forEach((component) => {
            if(component.value === MODULE[currentModule].value)
            {
                component.checked = true;
            }
        });
}

const updateOpinionSVGColor = () => {
    $(document).ready(() => {
        $('input[type="radio"]').click(function(){
            $(this).not(':checked').prop("checked", true);
        });

        $(".opinion-label").mouseenter(function() {
            $(this).find("path, polygon, circle").attr("stroke", "#4ED738");
            $(this).find("path, polygon, circle").attr("fill", "#fff");
         });
        $(".opinion-label").mouseleave(function() {
            $(this).find("path, polygon, circle").attr("stroke", "#959595");
            $(this).find("path, polygon, circle").attr("fill", "#fff");
         });

    });
}

const initializeFeedbackModal = () => {
    $(function () {
        $("#feedback_close_btn").click(function () {
            $("#feedback_modal").modal("hide");
        });
    });
    updateOpinionSVGColor();
    checkGivingFeedbackFor();
}

module.exports = {
    initializeFeedbackModal,
}