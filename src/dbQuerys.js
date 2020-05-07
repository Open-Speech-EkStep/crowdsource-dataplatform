const envVars = process.env;
const pgp = require('pg-promise')();
const db = pgp(`postgres://${envVars.DB_USER}:${envVars.DB_PASS}@${envVars.DB_HOST}/${envVars.DB_NAME}`);
//, userId = $1
const updateAndFetchquery = 'update sentences set assign = true where "sentenceId" in (select "sentenceId" from sentences where assign = false limit 10) returning *;'

const updateDbWithFileName = function (file,id) {
    db.any( 'update sentences set "fileName" = $1 where "sentenceId" = $2' , [file,id])
}

const updateAndFetch = function (req, res) {
    let userId = req.cookies.userId;
    if(!userId) return res.end(400);
    db.many( updateAndFetchquery)
        .then(data => {
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