const unassignIncompleteSentences = ' update sentences set "assign" = false,"assignDate" = NULL,"userName" = NULL,"ageGroup" = NULL, "gender" = NULL, "motherTongue" = NULL, "userId" = NULL where "fileName" IS NULL AND "userName" !=  AND "userId" = ;'

const sentencesCount = 'select count(*) from sentences where "userId" = and "userName" = ;'

const updateAndGetSentencesQuery = 'update sentences set assign = true, \
"assignDate" = current_date, "userId" = $1 where "sentenceId" in (select "sentenceId" from sentences \
where assign = false limit 10) returning "sentenceId","sentence";'

const setUserDetailsAndFileName = 'update sentences set "fileName" = $1, "userName" = $2, "ageGroup" =$3, "gender" = $4, "motherTongue" = $5 \
where "sentenceId" = $6 AND "userId" = $7:'

const setNewUserAndFileName = 'insert into changeduser ("fileName","userName","ageGroup","gender","motherTongue","userId","sentenceId") values ($1,$2,$3,$4,$5,$6,$7);'


module.exports = {
    unassignIncompleteSentences,
    sentencesCount,
    updateAndGetSentencesQuery,
    setNewUserAndFileName,
    setUserDetailsAndFileName
}