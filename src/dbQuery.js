const unassignIncompleteSentences = ' update sentences set "assign" = false,"assignDate" = NULL,"userName" = NULL,"ageGroup" = NULL,\
 "gender" = NULL, "motherTongue" = NULL, "userId" = NULL where "fileName" IS NULL AND  "userId" = $1 AND "userName" != $2;'

const sentencesCount = 'select count(*) from sentences where "userId" = $1 AND "userName" = $2;'

const updateAndGetSentencesQuery = 'update sentences set assign = true, \
"assignDate" = current_date, "userId" = $1, "userName" = $2, "ageGroup" =$3, "gender" = $4, "motherTongue" = $5 \
where "sentenceId" in (select "sentenceId" from sentences \
where assign = false limit 10) returning "sentenceId","sentence";'

const UpdateFileName = 'update sentences set "fileName" = $1 \
where "sentenceId" = $2 AND "userId" = $3:'

const setNewUserAndFileName = 'insert into changeduser ("fileName","userName","ageGroup","gender","motherTongue","userId","sentenceId") values ($1,$2,$3,$4,$5,$6,$7);'


module.exports = {
    unassignIncompleteSentences,
    sentencesCount,
    updateAndGetSentencesQuery,
    setNewUserAndFileName,
    UpdateFileName
}