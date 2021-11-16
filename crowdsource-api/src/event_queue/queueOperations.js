const queue = require('./queue');
const config = require('config');
const autoValidationEnabled = config.autoValidation ? config.autoValidation == "enabled" : false;

const sendForAutoValidation = async (contribution_id) => {
    if (!autoValidationEnabled) {
		return;
	}

    console.log(`send event to queue for ${contribution_id}`)
    try {
        await queue.produceEvent(`${contribution_id}`);
    }
    catch (error) {
        console.log(`Queue error: ${error}`)
    }
}

module.exports = {
    sendForAutoValidation
}