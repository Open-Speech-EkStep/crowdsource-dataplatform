const envVars = process.env;
const pgp = require('pg-promise')();
const db = pgp(`postgres://${envVars.DB_USER}:${envVars.DB_PASS}@${envVars.DB_HOST}/${envVars.DB_NAME}`);

 const updateAndFetchq = 'update sentences set assign = true where "sentenceId" in (select "sentenceId" from sentences where assign = false limit 10) returning *;'

const updateDbWithFileName = function (file,id) {
    db.any( 'update sentences set "fileName" = $1 where "sentenceId" = $2' , [file,id])
}

const updateAndFetch = function (req, res) {
    db.many( updateAndFetchq)
        .then(data => {
            res.render('record.ejs', { sentences: data });
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        })
    }

module.exports = {
    updateAndFetch,
    updateDbWithFileName,
} 