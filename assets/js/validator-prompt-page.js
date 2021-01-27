const {showInstructions} = require('./validator-instructions')

$(document).ready(()=>{
    showInstructions()
});

$("#instructions-link").on('click', showInstructions);
