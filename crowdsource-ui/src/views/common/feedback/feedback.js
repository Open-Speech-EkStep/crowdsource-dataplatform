const {CURRENT_MODULE,MODULE, SELECT_PAGE_OPTIONS_FEEDBACK, OPINION_RATING_MAPPING, ALL_LANGUAGES} = require('./constants');
const fetch = require('./fetch')
const { feedback_top_component } = require('./env-api');


const fetchUsername = () => {
    const speakerDetails = JSON.parse(localStorage.getItem('speakerDetails'));

    if(speakerDetails !== null)
    {
        $('#email').val(speakerDetails['userName']);
    }
}

const checkGivingFeedbackFor = () => {
        const currentModule = localStorage.getItem(CURRENT_MODULE);
        document.querySelectorAll('input[name="moduleSelectRadio"]').forEach((component) => {
            try{
                if(component.value === MODULE[currentModule].value)
                {
                    component.checked = true;
                }
            } catch(error){
                document.querySelector('#others_id').checked = true;            
            }
        });
};

const addColorPathSVG = (element, color) => {
    $(element).attr("stroke", color);            
};

const removeShadowSVG = (element) => {
    $(element).css('-webkit-box-shadow', '');
    $(element).css('-moz-box-shadow', '');
    $(element).css('box-shadow', '');
    $(element).css('stroke-width', 1);
    $(element).find('.double-stroke').css('stroke-width', 2);
};

const resetSVG = () => {
    addColorPathSVG("#very_sad_svg_boundary", "#FCE6E6");
    addColorPathSVG("#sad_svg_boundary", "#FDF4EC");
    addColorPathSVG("#neutral_svg_boundary", "#E6F2FF");
    addColorPathSVG("#happy_svg_boundary", "#EDFBEB");
    addColorPathSVG("#very_happy_svg_boundary", "#DFEDDA");

    removeShadowSVG('#very_sad_label');
    removeShadowSVG('#sad_label');
    removeShadowSVG('#neutral_label');
    removeShadowSVG('#happy_label');
    removeShadowSVG('#very_happy_label');
}

const selectEmoji = (element, stroke, rgba) => {
    $(element).find("path, polygon, circle").attr("stroke", stroke);
    $(element).css('-webkit-box-shadow', `0px 4px 12px ${rgba}`);
    $(element).css('-moz-box-shadow', `0px 4px 12px ${rgba}`);
    $(element).css('box-shadow', `0px 4px 12px ${rgba}`);
    $(element).css('stroke-width', 2);
    $(element).find('.double-stroke').css('stroke-width', 4);
}


const updateOpinionSVGColor = () => {
    $(document).ready(() => {
        $('input[name="opinionRadio"]').click(function(){ 
            $(this).not(':checked').prop("checked", true);
        });

        $('input[name="opinionRadio"]').on('change', function() {
            resetSVG();

            if($('input[name="opinionRadio"]:checked').val() === 'very_sad')
            {
                selectEmoji("#very_sad_label", "#E30606", "rgba(227, 6, 6, 0.5)");
            }
            else if($('input[name="opinionRadio"]:checked').val() === 'sad')
            {
                selectEmoji("#sad_label", "#EA913F", "rgba(234, 145, 63, 0.5)");
            }
            else if($('input[name="opinionRadio"]:checked').val() === 'neutral')
            {
                selectEmoji("#neutral_label", "#007BFF", "rgba(0, 123, 255, 0.5)");
            }
            else if($('input[name="opinionRadio"]:checked').val() === 'happy')
            {
                selectEmoji("#happy_label", "#4ED738", "rgba(78, 215, 56, 0.5)")
            }
            else if($('input[name="opinionRadio"]:checked').val() === 'very_happy')
            {
                selectEmoji("#very_happy_label", "#2A8908", "rgba(42, 137, 8, 0.5)")
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
                $("#select_page_id").find('option[value="' + page + '"]').attr("selected", "selected");
               
            } catch (error) {

            }
        }
    });
};

const enableSubmit = function () {
    const module = $("#moduleSelectRadio");
    const target_page = $("#select_page_id");
    const opinion_rating = $("#opinionRadio");
    $('input[name="opinionRadio"]').on('change', () => {
        const isEmailValid = $('#email').val().length > 0 || feedback_top_component === 'false';
        if($('input[name="opinionRadio"]').is(':checked') && isEmailValid)
        {    
            $("#submit_btn").attr('disabled', false);
        }
        else {
            $("#submit_btn").attr('disabled', true);
        }
    })    
    if(feedback_top_component === 'true'){
        $('#email').on('input', () => {
            if($('input[name="opinionRadio"]').is(':checked') && $('#email').val().length > 0)
            {    
                $("#submit_btn").attr('disabled', false);
            }
            else {
                $("#submit_btn").attr('disabled', true);
            }
        })
    }
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

    const username = $('#email').val() || "Anonymous";
    const moduleType = $('input[name = "moduleSelectRadio"]:checked').val();
    const targetPage = $("#select_page_id").val();

    fd.append('email', username);
    fd.append('feedback', feedback_description);
    fd.append('category', category);
    fd.append('language', language);
    fd.append('module', moduleType);
    fd.append('target_page', targetPage);
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
    if(opinion) opinion.checked = false;
    resetSVG();
    $("#submit_btn").attr('disabled', true);
    checkGivingFeedbackFor();
    updateSelectPageWhenModuleChanges();
    fetchUsername();
}

const initializeFeedbackModal = () => {
    
    $(() => {
        $("#feedback_close_btn").click(() => {
            $("#feedback_modal").modal("hide");
            $(".modal-backdrop").removeClass("show").removeClass("modal-backdrop");
            resetFeedback();
        });

        $("#feedback_thanku_close_btn").click(() => {
            $("#feedback_thanku_modal").modal("hide");
            $(".modal-backdrop").removeClass("show").removeClass("modal-backdrop");
        });
    });
    updateOpinionSVGColor();
    checkGivingFeedbackFor();
    updateSelectPageWhenModuleChanges();
    fetchUsername();
    $('#feedback_button').on('click', () => {
        enableSubmit();
    })
    if(feedback_top_component === 'true'){
        $('.email-component').show()
        $('.content-component').show()
        $('.page-type-component').show()
    }
    $('#submit_btn').on('click', handleFeedbackSubmit);
};

module.exports = {
    initializeFeedbackModal,
}