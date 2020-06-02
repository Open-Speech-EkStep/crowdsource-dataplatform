const { encrypt } = require("./encryptAndDecrypt")
const { UpdateFileNameAndUserDetails, setNewUserAndFileName,
    unassignIncompleteSentences, updateAndGetSentencesQuery,
    sentencesCount, getCountOfTotalSpeakerAndRecordedAudio, getGenderData,
    getAgeGroupsData, getMotherTonguesData } = require("./dbQuery");
const { KIDS_AGE_GROUP, ADULT, KIDS } = require("./constants")
const envVars = process.env;
const pgp = require('pg-promise')();
const db = pgp(`postgres://${envVars.DB_USER}:${envVars.DB_PASS}@${envVars.DB_HOST}/${envVars.DB_NAME}`);



const updateDbWithFileName = function (file, sentenceId, speakerDetails, userId, cb) {
    const speakerDetailsJson = JSON.parse(speakerDetails);
    let ageGroup = null, gender = null, motherTongue = null;
    if (speakerDetailsJson) {
        ageGroup = speakerDetailsJson.age;
        gender = speakerDetailsJson.gender;
        motherTongue = speakerDetailsJson.motherTongue;
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
            else {
                cb(200, { success: true })
            }
        })
        .catch((err) => {
            console.log(err);
            cb(500, { error: true })
        })
}

const getSentencesBasedOnAge = function (ageGroup, encryptedUserId, userName) {
    if (ageGroup === KIDS_AGE_GROUP) {
        return sentences = db.many(updateAndGetSentencesQuery, [encryptedUserId, userName, KIDS]);
    } else {
        return sentences = db.many(updateAndGetSentencesQuery, [encryptedUserId, userName, ADULT]);
    }
}

const updateAndGetSentences = async function (req, res) {
    const userId = req.cookies.userId;
    const userName = req.body.userName;
    if (!userId || userName === null || userName === undefined) {
        res.status(400).send({ error: 'required parameters missing' })
        return;
    }
    const ageGroup = req.body.age;
    const encryptedUserId = encrypt(userId);
    const sentences = getSentencesBasedOnAge(ageGroup, encryptedUserId, userName)
    const count = db.one(sentencesCount, [encryptedUserId, userName]);
    const unAssign = db.any(unassignIncompleteSentences, [encryptedUserId, userName])
    Promise.all([sentences, count, unAssign])
        .then(response => {
            res.status(200).send({ data: response[0], count: response[1].count });
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        })
}


const getAllDetails = async function () {
    return db.any(getCountOfTotalSpeakerAndRecordedAudio);
}

const getAllInfo = function () {
    const genderData = db.any(getGenderData);
    const ageGroups = db.any(getAgeGroupsData);
    const motherTongues = db.any(getMotherTonguesData);
    return Promise.all([genderData, ageGroups, motherTongues])
}

module.exports = {
    updateAndGetSentences,
    updateDbWithFileName,
    getAllDetails,
    getAllInfo
} 