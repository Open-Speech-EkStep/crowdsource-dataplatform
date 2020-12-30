const unassignIncompleteSentences = 'update sentences set "assign" = false,"assignDate" = NULL,"userName" = NULL,"ageGroup" = NULL,\
 "gender" = NULL, "motherTongue" = NULL, "userId" = NULL where "fileName" IS NULL AND "userId" = $1 AND "userName" != $2;'

const unassignIncompleteSentencesWhenLanChange = 'update sentences set "assign" = false,"assignDate" = NULL,"userName" = NULL,"ageGroup" = NULL,\
 "gender" = NULL, "motherTongue" = NULL, "userId" = NULL where "fileName" IS NULL AND "userId" = $1 AND "language" != $2;'

const sentencesCount = 'select count(*) from sentences where "userId" = $1 AND "userName" = $2 AND "language" = $3 AND "fileName" IS NOT NULL;'

const updateAndGetSentencesQuery = 'update sentences set assign = true, \
"assignDate" = current_date, "userId" = $1, "userName" = $2 \
where "sentenceId" in (select "sentenceId" from sentences where "assign" = false AND "label" = $3 AND "language" = $4 limit 10) returning "sentenceId","sentence";'

// const updateAndGetSentencesQueryForAdult = 'update sentences set assign = true, \
// "assignDate" = current_date, "userId" = $1, "userName" = $2 \
// where "sentenceId" in ((select "sentenceId" from sentences where "assign" = false AND "label" = $3 limit 5) \
// union \
// (select "sentenceId" from sentences where "assign" = false AND "label" = $4 limit 5)) returning "sentenceId","sentence";'

const UpdateFileNameAndUserDetails = 'update sentences set "fileName" = $1 ,"ageGroup" = $2,"gender" = $3,"motherTongue" = $4 \
where "sentenceId" = $5 AND "userId" = $6 returning "fileName";'

const setNewUserAndFileName = 'insert into changeduser ("fileName","userId","sentenceId") values ($1,$2,$3);'

const getCountOfTotalSpeakerAndRecordedAudio = 'SELECT COUNT(*),0 as index \
FROM (SELECT DISTINCT ("userId", "userName") \
FROM sentences where "fileName" IS NOT NULL and language = $1) as allRecord UNION ALL (select count(*),1 as index from sentences  where "fileName" IS NOT NULL and language = $1);'

const getMotherTonguesData = 'select data."motherTongue", count (*) from (select "userId","userName","motherTongue" from sentences where "fileName" is not null group by "motherTongue","userId","userName") as data group by data."motherTongue";'

const getAgeGroupsData = 'select data."ageGroup", count (*) from (select "userId","userName","ageGroup" from sentences where "fileName" is not null group by "ageGroup","userId","userName") as data group by data."ageGroup";'
                         
const getGenderData = 'select data."gender", count (*) from (select "userId","userName","gender" from sentences where "fileName" is not null group by "gender","userId","userName") as data group by data."gender";'

module.exports = {
    unassignIncompleteSentences,
    sentencesCount,
    updateAndGetSentencesQuery,
    setNewUserAndFileName,
    UpdateFileNameAndUserDetails,
    getCountOfTotalSpeakerAndRecordedAudio,
    getMotherTonguesData,
    getGenderData,
    getAgeGroupsData,
    unassignIncompleteSentencesWhenLanChange,
}