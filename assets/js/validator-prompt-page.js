const {showInstructions} = require('./validator-instructions')

const decideToShowPopUp = () => {
    const validatorDetails = localStorage.getItem('validatorDetails');
    const parsedDetails = JSON.parse(validatorDetails);
    const currentValidator = localStorage.getItem('currentValidator');
    if (!(parsedDetails.hasOwnProperty(currentValidator))) {
        localStorage.setItem('validatorDetails', JSON.stringify(Object.assign(parsedDetails, {[currentValidator]: currentValidator})));
        showInstructions()
    }
}

$(document).ready(decideToShowPopUp);

$("#instructions-link").on('click', showInstructions);

module.exports = {decideToShowPopUp};
