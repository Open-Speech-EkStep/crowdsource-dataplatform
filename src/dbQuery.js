const unassignIncompleteSentences = 'delete from "contributions" cont using "contributors" con where \
cont.contributed_by = con.contributor_id and cont.audio_path is null and cont.action = \'assigned\' and con.contributor_identifier = $1 and user_name!=$2;'

const unassignIncompleteSentencesWhenLanChange = 'delete from "contributions" cont using "contributors" con, sentences sen \
where sen."sentenceId" = cont."sentenceId" and  cont.contributed_by = con.contributor_id and cont.audio_path is null and cont.action = \'assigned\' \
and con.contributor_identifier = $1 and user_name=$2 and sen.language != $3;'

const sentencesCount = 'select count(s.*) from sentences s \
inner join "contributions" cont on s."sentenceId" = cont."sentenceId" \
inner join "contributors" con on cont.contributed_by = con.contributor_id \
where con.contributor_identifier = $1 and user_name=$2 AND s."language" = $3 and cont.action = \'completed\';'

const updateAndGetSentencesQuery = '\
INSERT INTO "contributors" ("user_name","contributor_identifier")  select $2, $1 \
where not exists \
(select "contributor_id" from "contributors" where "contributor_identifier" = $1 and user_name=$2); \
update "contributors" set "age_group" = $7, gender = $6, mother_tongue = $5 \
where contributor_identifier = $1 and user_name = $2; \
with ins ("sentenceId") as \
( insert into "contributions" ("action","sentenceId", "date", "contributed_by") \
select \'assigned\', sentences."sentenceId", now(), con."contributor_id" \
from sentences inner join "contributors" con on con."contributor_identifier" = $1 and user_name=$2 \
left join "contributions" cont on cont."sentenceId"= sentences."sentenceId" and cont.contributed_by = con.contributor_id \
where language = $4 and label=$3 \
and (coalesce(cont.action,\'\')!=\'completed\' or (cont.action=\'completed\' and cont.contributed_by != con.contributor_id)) \
group by sentences."sentenceId", con."contributor_id" \
limit 5  returning "sentenceId") \
select ins."sentenceId", sentences.sentence from ins  \
  inner join sentences on sentences."sentenceId" = ins."sentenceId";'

const updateAndGetUniqueSentencesQuery = '\
INSERT INTO "contributors" ("user_name","contributor_identifier")  select $2, $1 \
where not exists \
(select "contributor_id" from "contributors" where "contributor_identifier" = $1 and user_name=$2); \
update "contributors" set "age_group" = $7, gender = $6, mother_tongue = $5 \
where contributor_identifier = $1 and user_name = $2; \
with ins ("sentenceId") as \
( insert into "contributions" ("action","sentenceId", "date", "contributed_by") \
select \'assigned\', sentences."sentenceId", now(), con."contributor_id" \
from sentences inner join "contributors" con on con."contributor_identifier" = $1 and user_name=$2 \
left join "contributions" cont on cont."sentenceId"= sentences."sentenceId" \
where sentences."state" is null and language = $4 and label=$3 and cont."action" is NULL limit 5 \
  returning "sentenceId") \
select ins."sentenceId", sentences.sentence from ins  \
  inner join sentences on sentences."sentenceId" = ins."sentenceId";'

const getValidationSentencesQuery = 'select audio_path, con."sentenceId", sen.sentence \
    from contributions con inner join sentences sen on sen."sentenceId"=con."sentenceId" and con.action=\'completed\' \
    where sen."state"= \'contributed\' and language=$1 group by audio_path, con."sentenceId", sen.sentence order by RANDOM() limit 5;'

const addValidationQuery = 'insert into validations (contribution_id, "action", validated_by, "date") \
select contribution_id, $3, $1, now() from contributions inner join sentences on sentences."sentenceId"=contributions."sentenceId" \
where sentences."sentenceId" = $2 and sentences.state = \'contributed\';'

const updateSentencesWithValidatedState = 'update sentences set "state" = \
\'validated\' where "sentenceId" = $1;'

const UpdateAudioPathAndUserDetails = 'WITH src AS ( \
    select contributor_id from "contributors" \
    where contributor_identifier = $6 and user_name = $7\
    ) \
UPDATE "contributions" \
SET "audio_path" = $1, "action" = \'completed\' , "date" = now(), "state_region" = $8, "country" = $9\
FROM src \
WHERE "sentenceId" = $5 AND contributed_by  = src.contributor_id \
returning "audio_path";'

const updateSentencesWithContributedState = 'update sentences set state = \'contributed\' where "sentenceId" = $1;'

const setNewUserAndFileName = 'insert into changeduser ("fileName","userId","sentenceId") values ($1,$2,$3);'

const getCountOfTotalSpeakerAndRecordedAudio = 'select  count(DISTINCT(con.*)), 0 as index \
from "contributors" con inner join "contributions" cont on con.contributor_id = cont.contributed_by inner join "sentences" s on  s."sentenceId" = cont."sentenceId"  where s.language = $1 \
UNION ALL (select count(*),1 as index from sentences s inner join "contributions" cont on cont."sentenceId" = s."sentenceId" where s.language = $1);'

const getMotherTonguesData = 'select data."mother_tongue", count (*) from (select con."mother_tongue" from sentences s inner join "contributions" cont on s."sentenceId" = cont."sentenceId" and "action"=\'completed\' inner join "contributors" con on con.contributor_id = cont.contributed_by where s.language = $1 group by con."mother_tongue", con.user_name, con.contributor_identifier) as data group by data."mother_tongue";'

const getAgeGroupsData = 'select data."age_group", count (*) from (select con."age_group" from sentences s inner join "contributions" cont on s."sentenceId" = cont."sentenceId" and "action"=\'completed\' inner join "contributors" con on con.contributor_id = cont.contributed_by where s.language = $1 group by con."age_group", con.user_name, con.contributor_identifier) as data group by data."age_group";'

const getGenderData = 'select data."gender", count (*) from (select con."gender" from sentences s inner join "contributions" cont on s."sentenceId" = cont."sentenceId" and "action"=\'completed\' inner join "contributors" con on con.contributor_id = cont.contributed_by where s.language = $1 group by con."gender", con.user_name, con.contributor_identifier) as data group by data."gender";'

module.exports = {
    unassignIncompleteSentences,
    sentencesCount,
    updateAndGetSentencesQuery,
    updateAndGetUniqueSentencesQuery,
    getValidationSentencesQuery,
    setNewUserAndFileName,
    UpdateAudioPathAndUserDetails,
    getCountOfTotalSpeakerAndRecordedAudio,
    getMotherTonguesData,
    getGenderData,
    getAgeGroupsData,
    unassignIncompleteSentencesWhenLanChange,
    updateSentencesWithContributedState,
    addValidationQuery,
    updateSentencesWithValidatedState
}
