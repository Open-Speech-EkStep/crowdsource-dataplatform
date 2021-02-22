const unassignIncompleteSentences = 'delete from "contributions" cont using "contributors" con where \
cont.contributed_by = con.contributor_id and cont.audio_path is null and cont.action = \'assigned\' and con.contributor_identifier = $1;'

const unassignIncompleteSentencesWhenLanChange = 'delete from "contributions" cont using "contributors" con, sentences sen \
where sen."sentenceId" = cont.sentence_id and  cont.contributed_by = con.contributor_id and cont.audio_path is null and cont.action = \'assigned\' \
and con.contributor_identifier = $1 and sen.language != $2;'

const sentencesCount = 'select count(s.*) from sentences s \
inner join "contributions" cont on s."sentenceId" = cont.sentence_id \
inner join "contributors" con on cont.contributed_by = con.contributor_id \
where con.contributor_identifier = $1 AND s."language" = $3;'

const updateAndGetSentencesQuery = 'with ins (sentence_id) as \
( insert into "contributions" ("action","sentence_id", "date", "contributed_by") \
select \'assigned\', "sentenceId", now(), con."contributor_id" \
from sentences inner join "contributors" con on con."contributor_identifier" = $1 \
left join "contributions" cont on cont."sentence_id"= sentences."sentenceId" \
where "state" is null and language = $4 and label=$3 and cont."action" is NULL limit 10 \
  returning "sentence_id") \
select ins.sentence_id, sentences.sentence from ins  \
  inner join sentences on sentences."sentenceId" = ins.sentence_id;'

// const updateAndGetSentencesQueryForAdult = 'update sentences set assign = true, \
// "assignDate" = current_date, "userId" = $1, "userName" = $2 \
// where "sentenceId" in ((select "sentenceId" from sentences where "assign" = false AND "label" = $3 limit 5) \
// union \
// (select "sentenceId" from sentences where "assign" = false AND "label" = $4 limit 5)) returning "sentenceId","sentence";'

const insertContributor = 'INSERT INTO "contributors" ("user_name","contributor_identifier")  select $2, $1 \
    where not exists \
    (select "contributor_id" from "contributors" where "contributor_identifier" = $1 and user_name=$2);'

const UpdateAudioPathAndUserDetails = 'WITH src AS ( \
    update "contributors" set "age_group" = $2, gender = $3, mother_tongue = $4 \
    where contributor_identifier = $6 and user_name = $7\
    RETURNING contributor_id \
    ) \
UPDATE "contributions" \
SET "audio_path" = $1, "action" = \'completed\' , "date" = now()\
FROM src \
WHERE sentence_id = $5 AND contributed_by  = src.contributor_id \
returning "audio_path";'

const updateSentencesWithContributedState = 'update sentences set state = \'contributed\' where "sentenceId" = $1;'

const setNewUserAndFileName = 'insert into changeduser ("fileName","userId","sentenceId") values ($1,$2,$3);'

const getCountOfTotalSpeakerAndRecordedAudio = 'select  count(DISTINCT(con.*)), 0 as index \
from "contributors" con inner join "contributions" cont on con.contributor_id = cont.contributed_by inner join "sentences" s on  s."sentenceId" = cont.sentence_id  where s.language = $1 \
UNION ALL (select count(*),1 as index from sentences s inner join "contributions" cont on cont.sentence_id = s."sentenceId" where s.language = $1);'

const getMotherTonguesData = 'select data."mother_tongue", count (*) from (select con."mother_tongue" from sentences s inner join "contributions" cont on s."sentenceId" = cont.sentence_id inner join "contributors" con on con.contributor_id = cont.contributed_by where s.language = $1 group by con."mother_tongue", con.user_name, con.contributor_identifier) as data group by data."mother_tongue";'

const getAgeGroupsData = 'select data."age_group", count (*) from (select con."age_group" from sentences s inner join "contributions" cont on s."sentenceId" = cont.sentence_id inner join "contributors" con on con.contributor_id = cont.contributed_by where s.language = $1 group by con."age_group", con.user_name, con.contributor_identifier) as data group by data."age_group";'

const getGenderData = 'select data."gender", count (*) from (select con."gender" from sentences s inner join "contributions" cont on s."sentenceId" = cont.sentence_id inner join "contributors" con on con.contributor_id = cont.contributed_by where s.language = $1 group by con."gender", con.user_name, con.contributor_identifier) as data group by data."gender";'

module.exports = {
    unassignIncompleteSentences,
    sentencesCount,
    updateAndGetSentencesQuery,
    setNewUserAndFileName,
    UpdateAudioPathAndUserDetails,
    getCountOfTotalSpeakerAndRecordedAudio,
    getMotherTonguesData,
    getGenderData,
    getAgeGroupsData,
    unassignIncompleteSentencesWhenLanChange,
    insertContributor,
    updateSentencesWithContributedState
}