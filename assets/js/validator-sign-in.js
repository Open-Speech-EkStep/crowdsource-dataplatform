const validateText = (target, signInBtn)=>{
    const username = target.value;
    if(!username){
        signInBtn.attr('disabled',"disabled");
        return;
    }
    signInBtn.removeAttr('disabled');
}

const landOnValidatingPromptPage = ()=>{
    const username = $("#validator-username").val();
    localStorage.setItem('currentValidator', username);
    window.location = "/validator/prompt-page";
}

$("#validator-username").on('keyup', (e)=>validateText(e.target, $("#validator-SignIn")));
$("#validator-SignIn").on('click', landOnValidatingPromptPage);

module.exports = {validateText, landOnValidatingPromptPage};

