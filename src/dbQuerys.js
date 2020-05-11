const {encrypt} = require("./encryptAndDecrypt")

const envVars = process.env;
const pgp = require('pg-promise')();
const db = pgp(`postgres://${envVars.DB_USER}:${envVars.DB_PASS}@${envVars.DB_HOST}/${envVars.DB_NAME}`);
//, userId = $1
const updateAndFetchquery = 'update sentences set assign = true, \
"assignDate" = current_date, "userId" = $1 where "sentenceId" in (select "sentenceId" from sentences \
where assign = false limit 10) returning *;'

const updateDbWithFileName = function (file, id,speakerDetails) {
    const speakerDetailsJson = JSON.parse( speakerDetails);
    const ageGroup = encrypt(speakerDetailsJson.age);
    const gender = encrypt(speakerDetailsJson.gender);
    const state = encrypt(speakerDetailsJson.state);
    const username = encrypt(speakerDetailsJson.username);

    db.any('update sentences set "fileName" = $1, "userName" = $2, "ageGroup" =$3, "gender" = $4, "state" = $5 where "sentenceId" = $6', [file,username,ageGroup,gender,state, id])
}

const updateAndFetch = function (req, res,) {
    const userId = req.cookies.userId;
    if (!userId) { return res.send(500); }
    const encryptUserId = encrypt(userId);
    db.many(updateAndFetchquery,[encryptUserId])
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