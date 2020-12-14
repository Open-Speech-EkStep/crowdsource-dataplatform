const fs = require("fs")
const { encrypt } = require("./encryptAndDecrypt")
const { UpdateFileNameAndUserDetails, setNewUserAndFileName,
    unassignIncompleteSentences, updateAndGetSentencesQuery,
    sentencesCount, getCountOfTotalSpeakerAndRecordedAudio, getGenderData,
    getAgeGroupsData, getMotherTonguesData,unassignIncompleteSentencesWhenLanChange } = require("./dbQuery");
const { KIDS_AGE_GROUP, ADULT, KIDS } = require("./constants")
const process = require('process');
const envVars = process.env;
const pgp = require('pg-promise')();

let cn = {
    user: envVars.DB_USER,
    password: envVars.DB_PASS,
    database: envVars.DB_NAME,
    host: envVars.DB_HOST,
    logging: false,
    dialect: 'postgres',
    ssl: false,
    dialectOptions: {
      ssl: false
    },
    operatorsAliases: false
  }

const db = pgp(cn);



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

const getSentencesBasedOnAge = function (ageGroup, encryptedUserId, userName,language) {
    if (ageGroup === KIDS_AGE_GROUP) {
        return sentences = db.many(updateAndGetSentencesQuery, [encryptedUserId, userName, KIDS,language]);
    } else {
        return sentences = db.many(updateAndGetSentencesQuery, [encryptedUserId, userName,ADULT,language]);
    }
}

const updateAndGetSentences = function (req, res) {
    const userId = req.cookies.userId;
    const userName = req.body.userName;
    const language = req.body.language;
    if (!userId || userName === null || userName === undefined) {
        res.status(400).send({ error: 'required parameters missing' })
        return;
    }
    const ageGroup = req.body.age;
    const encryptedUserId = encrypt(userId);
    const sentences = getSentencesBasedOnAge(ageGroup, encryptedUserId, userName,language)
    const count = db.one(sentencesCount, [encryptedUserId, userName,language]);
    const unAssign = db.any(unassignIncompleteSentences, [encryptedUserId, userName])
    const unAssignWhenLanChange = db.any(unassignIncompleteSentencesWhenLanChange, [encryptedUserId, language])
    Promise.all([sentences, count, unAssign,unAssignWhenLanChange])
        .then(response => {
            res.status(200).send({ data: response[0], count: response[1].count });
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        })
}

const getAllDetails = function () {
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