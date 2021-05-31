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
    });
}
const updateSelectPageWhenModuleChanges = () => {
    $('input[name="moduleSelectRadio"]').on('change', function() {
        $("#select_page_id").find('option').remove().end();
        SELECT_PAGE_OPTIONS_FEEDBACK.forEach((data) => {
            if($('input[name="moduleSelectRadio"]:checked').val() === data.module)
            {
                data.pages.forEach((item, index) => {
                    $("#select_page_id").append($('<option>', {value: index, text: item}));
                });
            }
        });
    });

    SELECT_PAGE_OPTIONS_FEEDBACK.forEach((data) => {
        if($('input[name="moduleSelectRadio"]:checked').val() === data.module)
        {
            data.pages.forEach((item, index) => {
                $("#select_page_id").append($('<option>', {value: index, text: item}));
            });
        }
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
    updateSelectPageWhenModuleChanges();
}

module.exports = {
    initializeFeedbackModal,
}