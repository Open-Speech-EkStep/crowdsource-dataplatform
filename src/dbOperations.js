const { encrypt, decrypt } = require("./encryptAndDecrypt")
const { UpdateFileNameAndUserDetails, setNewUserAndFileName, updateAndGetSentencesQuery } = require("./dbQuery");
const envVars = process.env;
const pgp = require('pg-promise')();
const db = pgp(`postgres://${envVars.DB_USER}:${envVars.DB_PASS}@${envVars.DB_HOST}/${envVars.DB_NAME}`);



const updateDbWithFileName = function (file, sentenceId,speakerDetails, userId, cb) {
    const speakerDetailsJson = JSON.parse(speakerDetails);
    let ageGroup = null, gender = null, motherTongue = null;
    if (speakerDetailsJson) {
        ageGroup = encrypt(speakerDetailsJson.age);
        gender = encrypt(speakerDetailsJson.gender);
        motherTongue = encrypt(speakerDetailsJson.motherTongue);
    }
    const encryptUserId = encrypt(userId);
    db.any(UpdateFileNameAndUserDetails, [file, ageGroup, gender, motherTongue, sentenceId, encryptUserId])
        .then(() => cb(200, { success: true }))
        .catch(() => cb(500, { error: true }))
    db.any(setNewUserAndFileName, [file, encryptUserId, sentenceId])
        .then(() => cb(200, { success: true }))
        .catch(() => cb(500, { error: true }))
        .catch(err => {
            console.log(err);
            cb(500, { error: true })
        })
}

const updateAndGetSentences = function (req, res) {
    const username = req.body.username;
    const userId = req.cookies.userId;
    const userName = encrypt(username);
    const encryptUserId = encrypt(userId);
    db.many(updateAndGetSentencesQuery, [encryptUserId, userName])
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