const unassignIncompleteSentences = `delete from "contributions" cont using "contributors" con where \
cont.contributed_by = con.contributor_id and cont.audio_path is null and cont.action = \'assigned\' and con.contributor_identifier = $1 and user_name!=$2;`

const unassignIncompleteSentencesWhenLanChange = `delete from "contributions" cont using "contributors" con, sentences sen \
where sen."sentenceId" = cont."sentenceId" and  cont.contributed_by = con.contributor_id and cont.audio_path is null and cont.action = \'assigned\' \
and con.contributor_identifier = $1 and user_name=$2 and sen.language != $3;`

const sentencesCount = `select count(s.*) from sentences s \
inner join "contributions" cont on s."sentenceId" = cont."sentenceId" \
inner join "contributors" con on cont.contributed_by = con.contributor_id \
where con.contributor_identifier = $1 and user_name=$2 AND s."language" = $3 and cont.action = \'completed\';`

const updateAndGetOrderedSentencesQuery = `\
INSERT INTO "contributors" ("user_name","contributor_identifier")  select $2, $1 \
where not exists \
(select "contributor_id" from "contributors" where "contributor_identifier" = $1 and user_name=$2); \
update "contributors" set "age_group" = $7, gender = $6, mother_tongue = $5 \
where contributor_identifier = $1 and user_name = $2; \
with ins ("sentenceId") as \
( insert into "contributions" ("action","sentenceId", "date", "contributed_by") \
select \'assigned\', sentences."sentenceId", now(), con."contributor_id" \
from sentences inner join "contributors" con on con."contributor_identifier" = $1 and user_name=$2 and sentences.state!= 'reported'\
left join "contributions" cont on cont."sentenceId"= sentences."sentenceId" and cont.contributed_by = con.contributor_id \
where language = $4 and label=$3 \
and (coalesce(cont.action,\'assigned\')=\'assigned\' or (cont.action=\'completed\' and cont.contributed_by != con.contributor_id) or (cont.action=\'skipped\' and cont.contributed_by != con.contributor_id)) \
group by sentences."sentenceId", con."contributor_id" \
order by sentences."sentenceId" \
limit 5  returning "sentenceId") \
select ins."sentenceId", sentences.sentence from ins  \
  inner join sentences on sentences."sentenceId" = ins."sentenceId";`

const getSentencesForLaunch = `\
INSERT INTO "contributors" ("user_name","contributor_identifier")  select $2, $1 \
where not exists \
(select "contributor_id" from "contributors" where "contributor_identifier" = $1 and user_name=$2); \
update "contributors" set "age_group" = $7, gender = $6, mother_tongue = $5 \
where contributor_identifier = $1 and user_name = $2; \
with ins ("sentenceId") as \
( insert into "contributions" ("action","sentenceId", "date", "contributed_by") \
select \'assigned\', sentences."sentenceId", now(), con."contributor_id" \
from sentences inner join "contributors" con on con."contributor_identifier" = $1 and user_name=$2 and sentences.state!= 'reported' \
left join "contributions" cont on cont."sentenceId"= sentences."sentenceId" and cont.contributed_by = con.contributor_id \
where language = $4 and label=$3 \
and (coalesce(cont.action,\'assigned\')=\'assigned\' or (cont.action=\'completed\' and cont.contributed_by != con.contributor_id) or (cont.action=\'skipped\' and cont.contributed_by != con.contributor_id)) \
and sentences."sentenceId"= ANY($8::int[])\
group by sentences."sentenceId", con."contributor_id" \
order by sentences."sentenceId" \
limit 5  returning "sentenceId") \
select ins."sentenceId", sentences.sentence from ins  \
  inner join sentences on sentences."sentenceId" = ins."sentenceId";`

const updateAndGetSentencesQuery = `\
INSERT INTO "contributors" ("user_name","contributor_identifier")  select $2, $1 \
where not exists \
(select "contributor_id" from "contributors" where "contributor_identifier" = $1 and user_name=$2); \
update "contributors" set "age_group" = $7, gender = $6, mother_tongue = $5 \
where contributor_identifier = $1 and user_name = $2; \
with ins ("sentenceId") as \
( insert into "contributions" ("action","sentenceId", "date", "contributed_by") \
select \'assigned\', sentences."sentenceId", now(), con."contributor_id" \
from sentences inner join "contributors" con on con."contributor_identifier" = $1 and user_name=$2  and sentences.state!='reported'\
left join "contributions" cont on cont."sentenceId"= sentences."sentenceId" and cont.contributed_by = con.contributor_id \
where language = $4 and label=$3 \
and (coalesce(cont.action,'assigned')='assigned' or (cont.action='completed' and cont.contributed_by != con.contributor_id) or (cont.action=\'skipped\' and cont.contributed_by != con.contributor_id)) \
group by sentences."sentenceId", con."contributor_id" \
order by RANDOM() \
limit 5  returning "sentenceId") \
select ins."sentenceId", sentences.sentence from ins  \
  inner join sentences on sentences."sentenceId" = ins."sentenceId";`

const updateAndGetUniqueSentencesQuery = `\
INSERT INTO "contributors" ("user_name","contributor_identifier")  select $2, $1 \
where not exists \
(select "contributor_id" from "contributors" where "contributor_identifier" = $1 and user_name=$2); \
update "contributors" set "age_group" = $7, gender = $6, mother_tongue = $5 \
where contributor_identifier = $1 and user_name = $2; \
with ins ("sentenceId") as \
( insert into "contributions" ("action","sentenceId", "date", "contributed_by") \
select \'assigned\', sentences."sentenceId", now(), con."contributor_id" \
from sentences inner join "contributors" con on con."contributor_identifier" = $1 and user_name=$2 and sentences.state!= 'reported' \
left join "contributions" cont on cont."sentenceId"= sentences."sentenceId" \
where sentences."state" is null and language = $4 and label=$3 and cont."action" is NULL limit 5 \
  returning "sentenceId") \
select ins."sentenceId", sentences.sentence from ins  \
  inner join sentences on sentences."sentenceId" = ins."sentenceId";`

const getValidationSentencesQuery = `select con."sentenceId", sen.sentence, con.contribution_id \
    from contributions con \
    inner join contributors cont on con.contributed_by = cont.contributor_id and cont.contributor_identifier!=$2 \ 
    inner join sentences sen on sen."sentenceId"=con."sentenceId" and sen."state"= 'contributed' \
    left join validations val on val.contribution_id=con.contribution_id and val.action != 'skip' \
    where  con.action='completed' and language=$1 and COALESCE(val.validated_by, '')!= $2 group by con."sentenceId", sen.sentence, con.contribution_id \
    order by count(val.*) desc, RANDOM() limit 5;`

const addValidationQuery = `insert into validations (contribution_id, "action", validated_by, "date", "state_region", "country") \
select contribution_id, $3, $1, now(), $5, $6 from contributions inner join sentences on sentences."sentenceId"=contributions."sentenceId" \
where sentences."sentenceId" = $2 and sentences.state = \'contributed\' and contribution_id=$4;`

const updateSentencesWithValidatedState = `update sentences set "state" = \
\'validated\' where "sentenceId" = $1 and (select count(*) from validations where contribution_id = $2 and action != 'skip') >= \
(select value from configurations where config_name = 'validation_count');`

const updateContributionDetails = `WITH src AS ( \
    select contributor_id from "contributors" \
    where contributor_identifier = $6 and user_name = $7\
    ) \
UPDATE "contributions" \
SET "audio_path" = $1, "action" = \'completed\' , "date" = now(), "state_region" = $8, "country" = $9, "audio_duration" = $10\
FROM src \
WHERE "sentenceId" = $5 AND contributed_by  = src.contributor_id \
returning "audio_path";`

const updateMaterializedViews = 'REFRESH MATERIALIZED VIEW contributions_and_demo_stats;REFRESH MATERIALIZED VIEW daily_stats_complete;REFRESH MATERIALIZED VIEW gender_group_contributions;REFRESH MATERIALIZED VIEW age_group_contributions;REFRESH MATERIALIZED VIEW language_group_contributions;REFRESH MATERIALIZED VIEW state_group_contributions;REFRESH MATERIALIZED VIEW language_and_state_group_contributions;'

const updateSentencesWithContributedState = 'update sentences set state = \'contributed\' where "sentenceId" = $1;'

const getCountOfTotalSpeakerAndRecordedAudio = `select  count(DISTINCT(con.*)), 0 as index, 0 as duration \
from "contributors" con inner join "contributions" cont on con.contributor_id = cont.contributed_by and cont.action=\'completed\' inner join "sentences" s on  s."sentenceId" = cont."sentenceId"  where s.language = $1 \
UNION ALL (select count(*),1 as index, sum(cont.audio_duration) as duration from sentences s inner join "contributions" cont on cont."sentenceId" = s."sentenceId" and cont.action=\'completed\' where s.language = $1);`

const getMotherTonguesData = 'select data."mother_tongue", count (*) from (select con."mother_tongue" from sentences s inner join "contributions" cont on s."sentenceId" = cont."sentenceId" and "action"=\'completed\' inner join "contributors" con on con.contributor_id = cont.contributed_by where s.language = $1 group by con."mother_tongue", con.user_name, con.contributor_identifier) as data group by data."mother_tongue";'

const getAgeGroupsData = 'select data."age_group", count (*) from (select con."age_group" from sentences s inner join "contributions" cont on s."sentenceId" = cont."sentenceId" and "action"=\'completed\' inner join "contributors" con on con.contributor_id = cont.contributed_by where s.language = $1 group by con."age_group", con.user_name, con.contributor_identifier) as data group by data."age_group";'

const getGenderData = 'select data."gender", count (*) from (select con."gender" from sentences s inner join "contributions" cont on s."sentenceId" = cont."sentenceId" and "action"=\'completed\' inner join "contributors" con on con.contributor_id = cont.contributed_by where s.language = $1 group by con."gender", con.user_name, con.contributor_identifier) as data group by data."gender";'

const feedbackInsertion = 'Insert into feedbacks (subject,feedback,language) values ($1,$2,$3);'

const getAudioPath = 'select audio_path from contributions where contribution_id = $1;'

const saveReportQuery = `
INSERT INTO reports (reported_by,sentence_id,report_text,language,source) \
SELECT $1,$2,$3,$4,$5`;

const markContributionReported = "update contributions set action='reported' where contribution_id=$3 and (select count(distinct reported_by) from reports where source='validation' and sentence_id=$3 group by sentence_id) >= (select value from configurations where config_name='audio_report_limit');";

const markSentenceReported = `update sentences set state='reported' where "sentenceId"=$3 and (select count(distinct reported_by) from reports where source='contribution' and sentence_id=$3 group by sentence_id) >= (select value from configurations where config_name='sentence_report_limit');`;

const markContributionSkippedQuery = "update contributions set action='skipped' where contributed_by=(select contributor_id from contributors where user_name=$2 and contributor_identifier = $1) and \"sentenceId\"=$3;";

const rewardsInfoQuery = `select milestone as contributions, grade as badge from reward_milestones mil \
inner join reward_catalogue rew on mil.reward_catalogue_id = rew.id \
where UPPER(language) = UPPER($1) order by mil.milestone`;

const getTotalUserContribution = `select con.contribution_id from contributions con \
inner join sentences sen on sen."sentenceId"=con."sentenceId" where LOWER(language) = LOWER($2) \
and action = \'completed\' and con.contributed_by = $1`;

const getTotalUserValidation = 'select count(distinct(contribution_id)) as validation_count from validations \
where contribution_id in ($1:csv) and action = \'accept\''

const checkCurrentMilestoneQuery = `select grade, reward_milestone.milestone, id from reward_catalogue, \
(select milestone,reward_catalogue_id as rid from reward_milestones where milestone <= $1 \
and LOWER(language) = LOWER($2) order by milestone desc limit 1) \
as reward_milestone where id=reward_milestone.rid`;

const checkNextMilestoneQuery = `select grade, reward_milestone.milestone, id from reward_catalogue, \
(select milestone,reward_catalogue_id as rid from reward_milestones where milestone > $1 and milestone >= \
  (select milestone from reward_milestones, reward_catalogue where \
  id=reward_catalogue_id and grade is not null order by milestone limit 1) \
and language = $2 order by milestone limit 1) \
as reward_milestone where id=reward_milestone.rid and grade is not null`;

const findRewardInfo = 'select reward_catalogue_id, reward_catalogue.grade, generated_badge_id from rewards inner join reward_catalogue \
on reward_catalogue.id= rewards.reward_catalogue_id where contributor_id = $1 and language = $2 and category = $3';

const insertRewardQuery = `insert into rewards (contributor_id, language, reward_catalogue_id, category) select $1, $2, $3, $4 \
where not exists (select 1 from rewards where contributor_id=$1 and language=$2 and reward_catalogue_id=$3 and category=$4) returning generated_badge_id`;

const getContributorIdQuery = 'select contributor_id from contributors where contributor_identifier = $1 and user_name = $2';

const getValidationCountQuery = 'select count(*) from validations where contribution_id = $1 and action != \'skip\'';

const addContributorQuery = 'INSERT INTO "contributors" ("user_name","contributor_identifier")  select $2, $1 returning contributor_id';

const getBadges = 'select grade, reward_milestone.milestone, id from reward_catalogue, \
(select milestone,reward_catalogue_id as rid from reward_milestones where milestone <= $1 \
and LOWER(language) = LOWER($2) order by milestone desc) \
as reward_milestone where id=reward_milestone.rid';

module.exports = {
    unassignIncompleteSentences,
    sentencesCount,
    updateAndGetSentencesQuery,
    updateAndGetUniqueSentencesQuery,
    updateAndGetOrderedSentencesQuery,
    getValidationSentencesQuery,
    updateContributionDetails,
    getCountOfTotalSpeakerAndRecordedAudio,
    getMotherTonguesData,
    getGenderData,
    getAgeGroupsData,
    unassignIncompleteSentencesWhenLanChange,
    updateSentencesWithContributedState,
    addValidationQuery,
    updateSentencesWithValidatedState,
    feedbackInsertion,
    getAudioPath,
    saveReportQuery,
    getSentencesForLaunch,
    markContributionSkippedQuery,
    rewardsInfoQuery,
    getTotalUserContribution,
    getTotalUserValidation,
    findRewardInfo,
    insertRewardQuery,
    getContributorIdQuery,
    checkCurrentMilestoneQuery,
    checkNextMilestoneQuery,
    markSentenceReported,
    markContributionReported,
    updateMaterializedViews,
    getValidationCountQuery,
    getBadges,
    addContributorQuery
}
