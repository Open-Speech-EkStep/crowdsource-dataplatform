const { encrypt, decrypt } = require("./encryptAndDecrypt")
const { UpdateFileNameAndUserDetails, setNewUserAndFileName,
    unassignIncompleteSentences, updateAndGetSentencesQuery, sentencesCount } = require("./dbQuery");
const envVars = process.env;
const pgp = require('pg-promise')();
const db = pgp(`postgres://${envVars.DB_USER}:${envVars.DB_PASS}@${envVars.DB_HOST}/${envVars.DB_NAME}`);



const updateDbWithFileName = function (file, sentenceId, speakerDetails, userId, cb) {
    const speakerDetailsJson = JSON.parse(speakerDetails);
    let ageGroup = null, gender = null, motherTongue = null;
    if (speakerDetailsJson) {
        ageGroup = encrypt(speakerDetailsJson.age);
        gender = encrypt(speakerDetailsJson.gender);
        motherTongue = encrypt(speakerDetailsJson.motherTongue);
    }
    const encryptUserId = encrypt(userId);
    db.any(UpdateFileNameAndUserDetails, [file, ageGroup, gender, motherTongue, sentenceId, encryptUserId])
        .then((data) => {
            if (!data || !data.length) {
                db.any(setNewUserAndFileName, [file, encryptUserId, sentenceId])
                    .then(() => cb(200, { success: true }))
                    .catch((err) => {
                        console.log(err);
                        cb(500, { error: true })
                    })
            }
            else{
                cb(200, { success: true })
            }
        })
        .catch((err) => {
            console.log(err);
            cb(500, { error: true })
        })
}

const updateAndGetSentences = async function (req, res) {
    const userId = req.cookies.userId;
    const userName = req.body.userName;
    if (!userId || userName === null || userName === undefined) {
        res.status(400).send({ error: 'required parameters missing' })
        return;
    }
    const encryptedUserName = encrypt(userName);
    const encryptedUserId = encrypt(userId);
    const sentences = db.many(updateAndGetSentencesQuery, [encryptedUserId, encryptedUserName]);
    const count = db.one(sentencesCount, [encryptedUserId, encryptedUserName]);
    const unAssign = db.any(unassignIncompleteSentences, [encryptedUserId, encryptedUserName])
    Promise.all([sentences, count, unAssign])
        .then(response => {
            res.status(200).send({ data: response[0], count: response[1].count });
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