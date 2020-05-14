const { encrypt, decrypt } = require("./encryptAndDecrypt")

const envVars = process.env;
const pgp = require('pg-promise')();
const db = pgp(`postgres://${envVars.DB_USER}:${envVars.DB_PASS}@${envVars.DB_HOST}/${envVars.DB_NAME}`);

const updateAndGetSentencesQuery = 'update sentences set assign = true, \
"assignDate" = current_date, "userId" = $1 where "sentenceId" in (select "sentenceId" from sentences \
where assign = false limit 10) returning "sentenceId","sentence";'

const setUserDetailsAndFileName = 'update sentences set "fileName" = $1, "userName" = $2, "ageGroup" =$3, "gender" = $4, "motherTongue" = $5 \
where "sentenceId" = $6;'

const setNewUserAndFileName = 'insert into changeduser ("fileName","userName","ageGroup","gender","motherTongue","userId","sentenceId") values ($1,$2,$3,$4,$5,$6,$7);'

const updateDbWithFileName = function (file, sentenceId, speakerDetails, userId, cb) {
    const encryptUserId = encrypt(userId)
    let ageGroup = null, gender = null, motherTongue = null, userName = null;
    const speakerDetailsJson = JSON.parse(speakerDetails);
    if (speakerDetailsJson) {
        ageGroup = encrypt(speakerDetailsJson.age);
        gender = encrypt(speakerDetailsJson.gender);
        motherTongue = encrypt(speakerDetailsJson.motherTongue);
        userName = encrypt(speakerDetailsJson.username);
    }

    db.one('select "userId" from sentences where "sentenceId" = $1', sentenceId)
        .then(data => {
            const decryptedUserId = decrypt(data.userId)
            if (decryptedUserId === userId) {
                db.any(setUserDetailsAndFileName, [file, userName, ageGroup, gender, motherTongue, sentenceId, encryptUserId])
                .then(() => cb(200,{success:true}))
                .catch(() => cb(500,{error:true}))
            } else {
                db.any(setNewUserAndFileName, [file, userName, ageGroup, gender, motherTongue, encryptUserId,sentenceId])
                .then(() => cb(200,{success:true}))
                .catch(() => cb(500,{error:true}))
            }
        })
        .catch(err => {
            console.log(err);
            cb(500,{error:true})
        })
}

const updateAndGetSentences = function (req, res) {
    const userId = req.cookies.userId;
    if (!userId) { return res.sendStatus(400).send("Invalid UserId"); }
    const encryptUserId = encrypt(userId);
    db.many(updateAndGetSentencesQuery, [encryptUserId])
        .then(data => {
            res.status(200).send(data);
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