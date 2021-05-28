const {CURRENT_MODULE,MODULE, SELECT_PAGE_OPTIONS_FEEDBACK} = require('./constants.js');

const checkGivingFeedbackFor = () => {
        const currentModule = localStorage.getItem(CURRENT_MODULE);
        document.querySelectorAll('input[name="moduleSelectRadio"]').forEach((component) => {
            if(component.value === MODULE[currentModule].value)
            {
                component.checked = true;
            }
        });
}

const updateOpinionSVGColor = () => {
    $(document).ready(() => {
        $('input[name="opinionRadio"]').click(function(){ 
            $(this).not(':checked').prop("checked", true);
        });
        
        $('input[name="opinionRadio"]').on('change', function() {
            $(".opinion-label").find("path, polygon, circle").attr("stroke", "#818181");            
            if($('input[name="opinionRadio"]:checked').val() === 'very_sad')
            {
                $("#very_sad_label").find("path, polygon, circle").attr("stroke", "#E30606");
            }
            else if($('input[name="opinionRadio"]:checked').val() === 'sad')
            {
                $("#sad_label").find("path, polygon, circle").attr("stroke", "#EA913F");
            }
            else if($('input[name="opinionRadio"]:checked').val() === 'neutral')
            {
                $("#neutral_label").find("path, polygon, circle").attr("stroke", "#007BFF");
            }
            else if($('input[name="opinionRadio"]:checked').val() === 'happy')
            {
                $("#happy_label").find("path, polygon, circle").attr("stroke", "#4ED738");
            }
            else if($('input[name="opinionRadio"]:checked').val() === 'very_happy')
            {
                $("#very_happy_label").find("path, polygon, circle").attr("stroke", "#2A8908");
            }
        });
        
        // for hover effect in future
        // $(".opinion-label").mouseenter(function() {
        //     $(this).find("path, polygon, circle").attr("stroke", "#4ED738");
        //     $(this).find("path, polygon, circle").attr("fill", "#fff");
        //  });
        // $(".opinion-label").mouseleave(function() {
        //     $(this).find("path, polygon, circle").attr("stroke", "#959595");
        //     $(this).find("path, polygon, circle").attr("fill", "#fff");
        //  });

    });
}
const updateSelectPageWhenModuleChanges = () => {

}

const initializeFeedbackModal = () => {
    $(function () {
        $("#feedback_close_btn").click(function () {
            $("#feedback_modal").modal("hide");
        });
    });
    updateOpinionSVGColor();
    checkGivingFeedbackFor();
    updateSelectPageWhenModuleChanges();
}

module.exports = {
    initializeFeedbackModal,
}