const queue = require('./queue');

const sendForAutoValidation = async (contribution_id) => {
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