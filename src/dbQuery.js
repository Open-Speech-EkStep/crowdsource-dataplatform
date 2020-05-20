const unassignIncompleteSentences = 'update sentences set "assign" = false,"assignDate" = NULL,"userName" = NULL,"ageGroup" = NULL,\
 "gender" = NULL, "motherTongue" = NULL, "userId" = NULL where "fileName" IS NULL AND "userId" = $1 AND "userName" != $2;'

const sentencesCount = 'select count(*) from sentences where "userId" = $1 AND "userName" = $2 AND "fileName" IS NOT NULL;'

const updateAndGetSentencesQuery = 'update sentences set assign = true, \
"assignDate" = current_date, "userId" = $1, "userName" = $2 \
where "sentenceId" in (select "sentenceId" from sentences where "assign" = false AND "label" = $3 limit 10) returning "sentenceId","sentence";'

const UpdateFileNameAndUserDetails = 'update sentences set "fileName" = $1 ,"ageGroup" = $2,"gender" = $3,"motherTongue" = $4 \
where "sentenceId" = $5 AND "userId" = $6 returning "fileName";'

const setNewUserAndFileName = 'insert into changeduser ("fileName","userId","sentenceId") values ($1,$2,$3);'

const getCountOfTotalSpeakerAndRecordedAudio = 'SELECT COUNT(*) \
FROM (SELECT DISTINCT "userId", "userName" \
FROM sentences) as allRecord  UNION ALL (select count(*) from sentences  where "fileName" IS NOT NULL);'

const getMotherTonguesData = 'select "motherTongue" ,count("motherTongue") from sentences group by "motherTongue";'

const getAgeGroupsData = 'select "ageGroup" ,count("ageGroup") from sentences group by "ageGroup";'

const getGenderData = 'select "gender" ,count("gender") from sentences group by "gender";'

module.exports = {
    unassignIncompleteSentences,
    sentencesCount,
    updateAndGetSentencesQuery,
    setNewUserAndFileName,
    UpdateFileNameAndUserDetails,
    getCountOfTotalSpeakerAndRecordedAudio,
    getMotherTonguesData,
    getGenderData,
    getAgeGroupsData
}