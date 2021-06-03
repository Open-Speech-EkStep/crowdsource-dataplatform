const {CURRENT_MODULE,MODULE, SELECT_PAGE_OPTIONS_FEEDBACK, FEEDBACK_CATEGORY, OPINION_RATING_MAPPING, ALL_LANGUAGES} = require('./constants');
const fetch = require('./fetch')

const checkGivingFeedbackFor = () => {
        const currentModule = localStorage.getItem(CURRENT_MODULE);
        document.querySelectorAll('input[name="moduleSelectRadio"]').forEach((component) => {
            try{
                if(component.value === MODULE[currentModule].value)
                {
                    component.checked = true;
                }
            } catch(error){
                console.log(error);
                document.querySelector('#others_id').checked = true;            
            }
        });
};

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
};

const updateSelectPageWhenModuleChanges = () => {
    $("#select_page_id").find('option').remove().end();
    $('input[name="moduleSelectRadio"]').on('change', function() {
        $("#select_page_id").find('option').remove().end();
        SELECT_PAGE_OPTIONS_FEEDBACK.forEach((data) => {
            if($('input[name="moduleSelectRadio"]:checked').val() === data.module)
            {
                data.pages.forEach((item) => {
                    $("#select_page_id").append($('<option>', {value: item, text: item}));
                });   
            }
        });
    });

    SELECT_PAGE_OPTIONS_FEEDBACK.forEach((data) => {
        if($('input[name="moduleSelectRadio"]:checked').val() === data.module)
        {
            data.pages.forEach((item) => {
                $("#select_page_id").append($('<option>', {value: item, text: item}));
            });

            try { 
                const page = $('#target_page').val();
                console.log('page value: ' + page); 
                $("#select_page_id").find('option[value="' + page + '"]').attr("selected", "selected");
               
            } catch (error) {
                console.log('Page detection error: ' + error);  
            }
        }
    });
};

const readFeedbackCategoryFromConstantsFile = () => {
    // $("#category_id").find('option').remove().end();
    FEEDBACK_CATEGORY.forEach((category) => {           
        $("#category_id").append($('<option>', {value: category.value, text: category.text}));
    });
};

const enableSubmit = function () {
    const module = $("#moduleSelectRadio");
    const target_page = $("#select_page_id");
    const opinion_rating = $("#opinionRadio");
    $('input[name="opinionRadio"]').on('change', () => {
        if($('input[name="opinionRadio"]').is(':checked'))
        {    
            $("#submit_btn").attr('disabled', false);
        }
        else {
            $("#submit_btn").attr('disabled', true);
        }
    })    
    
}

const handleFeedbackSubmit = () => {
    var rating;
    var category = $("#category_id").val();
    var feedback_description = $("#feedback_description").val();
    var language = localStorage.getItem("contributionLanguage");

    if(language === null){
        ALL_LANGUAGES.forEach((lang) => {
            if(lang.id === localStorage.getItem("i18n")) { language = lang.value; }});
    }
        

    const fd = new FormData();
    OPINION_RATING_MAPPING.forEach((op) => {
        if(op.opinion === $('input[name = "opinionRadio"]:checked').val()){
            rating = op.value;
        }
    });

    if(category === 'category'){
        category = '';
    } 
    if($("#feedback_description").val().length === 0){
        category = '';
    }

    fd.append('feedback', feedback_description);
    fd.append('category', category);
    fd.append('language', language);
    fd.append('module', $('input[name = "moduleSelectRadio"]:checked').val());
    fd.append('target_page', $("#select_page_id").val());
    fd.append('opinion_rating', rating);
    
    fetch("/feedback", {
        method: "POST",
        credentials: 'include',
        mode: 'cors',
        body: fd,
    })
    .then((res) => res.json())
    .then((response) => {
        if(response.statusCode === 200){
            $("#feedback_modal").modal("hide");
            $("#feedback_thanku_modal").modal("show");  
            resetFeedback();      
        }
        else{
            alert('there is some error');
        }
    });
};

const resetFeedback = () => {
    const opinion = document.querySelector('input[name="opinionRadio"]:checked');
    const category = document.querySelector("#category_id option[value='category']");
    const feedback = document.querySelector("#feedback_description");

    if(category) category.selected = true;
    feedback.value = '';
    $(".opinion-label").find("path, polygon, circle").attr("stroke", "#818181");
    if(opinion) opinion.checked = false;
    $("#submit_btn").attr('disabled', true);
    checkGivingFeedbackFor();
    updateSelectPageWhenModuleChanges();
}
const initializeFeedbackModal = () => {
    
    $(() => {
        $("#feedback_close_btn").click(() => {
            $("#feedback_modal").modal("hide");
            resetFeedback();
        });

        $("#feedback_thanku_close_btn").click(() => {
            $("#feedback_thanku_modal").modal("hide");
        });
    });
    updateOpinionSVGColor();
    checkGivingFeedbackFor();
    updateSelectPageWhenModuleChanges();
    readFeedbackCategoryFromConstantsFile();

    $('#feedback_button').on('click', () => {
        enableSubmit();
    })
    
    $('#submit_btn').on('click', handleFeedbackSubmit);
};

module.exports = {
    initializeFeedbackModal,
}