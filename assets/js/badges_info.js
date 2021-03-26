const {performAPIRequest}= require('./utils');
const {CONTRIBUTION_LANGUAGE, DEFAULT_CON_LANGUAGE} = require('./constants');

$(document).ready(function () {
    const language = localStorage.getItem(CONTRIBUTION_LANGUAGE) || DEFAULT_CON_LANGUAGE;
    performAPIRequest(`/rewards-info?language=${language}`).then((data)=>{
        data.forEach((ele, index)=>{
            const rowId = index + 1;
    $(`#level-count-${rowId}`).html(rowId);

        })
    }).catch(()=>{

    })
});