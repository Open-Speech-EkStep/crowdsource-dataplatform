const { encrypt, decrypt } = require("./encryptAndDecrypt")

const envVars = process.env;
const pgp = require('pg-promise')();
const db = pgp(`postgres://${envVars.DB_USER}:${envVars.DB_PASS}@${envVars.DB_HOST}/${envVars.DB_NAME}`);
//, userId = $1
const updateAndFetchquery = 'update sentences set assign = true, \
"assignDate" = current_date, "userId" = $1 where "sentenceId" in (select "sentenceId" from sentences \
where assign = false limit 10) returning *;'

const setUserDetailsAndFileName = 'update sentences set "fileName" = $1, "userName" = $2, "ageGroup" =$3, "gender" = $4, "state" = $5 \
where "sentenceId" = $6;'

const setNewUserAndFileName = 'insert into changeduser ("fileName","userName","ageGroup","gender","state","userId","sentenceId") values ($1,$2,$3,$4,$5,$6,$7);'

const updateDbWithFileName = function (file, sentenceId, speakerDetails, userId) {
    const encryptUserId = encrypt(userId)
    let ageGroup = null, gender = null, state = null, userName = null;
    console.log(sentenceId);
    const speakerDetailsJson = JSON.parse(speakerDetails);
    if (speakerDetailsJson) {
        console.log(speakerDetails);
        ageGroup = encrypt(speakerDetailsJson.age);
        gender = encrypt(speakerDetailsJson.gender);
        state = encrypt(speakerDetailsJson.state);
        userName = encrypt(speakerDetailsJson.username);
    }


    db.any('select "userId" from sentences where "sentenceId" = $1', sentenceId)
        .then(data => {
            const decryptedUserId = decrypt(data[0].userId)
            if (decryptedUserId == userId) {
                db.any(setUserDetailsAndFileName, [file, userName, ageGroup, gender, state, sentenceId, encryptUserId])
            } else {
                db.any(setNewUserAndFileName, [file, userName, ageGroup, gender, state, encryptUserId,sentenceId])
            }
        })
        .catch(err => {
            console.log(err);
        })
}

const updateAndFetch = function (req, res, ) {
    const userId = req.cookies.userId;
    if (!userId) { return res.send(500); }
    const encryptUserId = encrypt(userId);
    db.many(updateAndFetchquery, [encryptUserId])
        .then(data => {
            console.log("data from DB received");
            res.status(200).send(data);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        })
}

module.exports = {
    updateAndFetch,
    updateDbWithFileName
} 