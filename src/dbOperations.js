const { encrypt, decrypt } = require("./encryptAndDecrypt")
const { UpdateFileName, setNewUserAndFileName, updateAndGetSentencesQuery } = require("./dbQuery");
const envVars = process.env;
const pgp = require('pg-promise')();
const db = pgp(`postgres://${envVars.DB_USER}:${envVars.DB_PASS}@${envVars.DB_HOST}/${envVars.DB_NAME}`);



const updateDbWithFileName = function (file, sentenceId, userId, cb) {
    const encryptUserId = encrypt(userId);
    db.any(UpdateFileName, [file, sentenceId, encryptUserId])
        .then(() => cb(200, { success: true }))
        .catch(() => cb(500, { error: true }))
    db.any(setNewUserAndFileName, [file, userName, ageGroup, gender, motherTongue, encryptUserId, sentenceId])
        .then(() => cb(200, { success: true }))
        .catch(() => cb(500, { error: true }))
        .catch(err => {
            console.log(err);
            cb(500, { error: true })
        })
}

const updateAndGetSentences = function (req, res) {
    const speakerDetails = req.body.speakerDetails;
    const userId = req.cookies.userId;
    let ageGroup = null, gender = null, motherTongue = null, userName = null;
    const speakerDetailsJson = JSON.parse(speakerDetails);
    if (speakerDetailsJson) {
        ageGroup = encrypt(speakerDetailsJson.age);
        gender = encrypt(speakerDetailsJson.gender);
        motherTongue = encrypt(speakerDetailsJson.motherTongue);
        userName = encrypt(speakerDetailsJson.username);
    }
    const encryptUserId = encrypt(userId);
    db.many(updateAndGetSentencesQuery, [encryptUserId, userName, ageGroup, gender, motherTongue])
        .then(data => {
            db.any(sentencesCount, [encryptUserId, userName])
                .then(count => {
                    res.status(200).send({ data, count });
                    db.many(unassignIncompleteSentences, [encryptUserId, userName])
                })
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        })
}

module.exports = {
    updateAndGetSentences,
    updateDbWithFileName
} 