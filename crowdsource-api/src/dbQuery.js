const unassignIncompleteMedia = `delete from contributions cont using contributors con where 
cont.contributed_by=con.contributor_id and cont.media is null and cont.action='assigned' and con.contributor_identifier=$1 and user_name!=$2;`

const unassignIncompleteMediaWhenLanChange = `delete from contributions cont using contributors con, dataset_row dr 
where dr.dataset_row_id=cont.dataset_row_id and cont.contributed_by=con.contributor_id and cont.media is null and cont.action='assigned' 
and con.contributor_identifier=$1 and user_name=$2;`

const mediaCount = `select count(dr.*) from dataset_row dr 
inner join "contributions" cont on dr."dataset_row_id"=cont."dataset_row_id" 
inner join "contributors" con on cont.contributed_by=con.contributor_id 
where con.contributor_identifier=$1 and user_name=$2 AND dr.media->>'language'=$3 and cont.action='completed';`

const updateAndGetOrderedMediaQuery = `\
INSERT INTO "contributors" ("user_name","contributor_identifier")  select $2, $1 \
where not exists \
(select "contributor_id" from "contributors" where "contributor_identifier" = $1 and user_name=$2); \
update "contributors" set "age_group" = $7, gender = $6, mother_tongue = $5 \
where contributor_identifier = $1 and user_name = $2; \
with ins ("dataset_row_id") as \
( insert into "contributions" ("action","dataset_row_id", "date", "contributed_by") \
select \'assigned\', dataset_row."dataset_row_id", now(), con."contributor_id" \
from dataset_row inner join "contributors" con on con."contributor_identifier" = $1 and user_name=$2 and coalesce(dataset_row.state,'')!= 'reported' \
left join "contributions" cont on cont."dataset_row_id"= dataset_row."dataset_row_id" and cont.contributed_by = con.contributor_id \
where language = $4 and difficulty_level=$3 \
and (coalesce(cont.action,\'assigned\')=\'assigned\' or (cont.action=\'completed\' and cont.contributed_by != con.contributor_id) or (cont.action=\'skipped\' and cont.contributed_by != con.contributor_id)) \
group by dataset_row."dataset_row_id", con."contributor_id" \
order by dataset_row."dataset_row_id" \
limit 5  returning "dataset_row_id") \
select ins."dataset_row_id", dataset_row.media ->> 'data' as sentence from ins  \
  inner join dataset_row on dataset_row."dataset_row_id" = ins."dataset_row_id";`

const getMediaForLaunch = `\
INSERT INTO "contributors" ("user_name","contributor_identifier")  select $2, $1 \
where not exists \
(select "contributor_id" from "contributors" where "contributor_identifier" = $1 and user_name=$2); \
update "contributors" set "age_group" = $7, gender = $6, mother_tongue = $5 \
where contributor_identifier = $1 and user_name = $2; \
with ins ("dataset_row_id") as \
( insert into "contributions" ("action","dataset_row_id", "date", "contributed_by") \
select \'assigned\', dataset_row."dataset_row_id", now(), con."contributor_id" \
from dataset_row inner join "contributors" con on con."contributor_identifier" = $1 and user_name=$2 and coalesce(dataset_row.state,'')!= 'reported' \
left join "contributions" cont on cont."dataset_row_id"= dataset_row."dataset_row_id" and cont.contributed_by = con.contributor_id \
where language = $4 and difficulty_level=$3 \
and (coalesce(cont.action,\'assigned\')=\'assigned\' or (cont.action=\'completed\' and cont.contributed_by != con.contributor_id) or (cont.action=\'skipped\' and cont.contributed_by != con.contributor_id)) \
and dataset_row."dataset_row_id"= ANY($9::int[])\
group by dataset_row."dataset_row_id", con."contributor_id" \
order by dataset_row."dataset_row_id" \
limit 5  returning "dataset_row_id") \
select ins."dataset_row_id", dataset_row.media ->> 'data' as sentence from ins  \
  inner join dataset_row on dataset_row."dataset_row_id" = ins."dataset_row_id";`

const updateAndGetMediaQuery = `\
INSERT INTO "contributors" ("user_name","contributor_identifier")  select $2, $1 \
where not exists \
(select "contributor_id" from "contributors" where "contributor_identifier" = $1 and user_name=$2); \
update "contributors" set "age_group" = $7, gender = $6, mother_tongue = $5 \
where contributor_identifier = $1 and user_name = $2; \
with ins ("dataset_row_id") as \
( insert into "contributions" ("action","dataset_row_id", "date", "contributed_by") \
select \'assigned\', dataset_row."dataset_row_id", now(), con."contributor_id" \
from dataset_row inner join "contributors" con on con."contributor_identifier" = $1 and user_name=$2  and coalesce(dataset_row.state,'')!= 'reported' \
left join "contributions" cont on cont."dataset_row_id"= dataset_row."dataset_row_id" and cont.contributed_by = con.contributor_id \
where language = $4 and difficulty_level=$3 \
and (coalesce(cont.action,'assigned')='assigned' or (cont.action='completed' and cont.contributed_by != con.contributor_id) or (cont.action=\'skipped\' and cont.contributed_by != con.contributor_id)) \
group by dataset_row."dataset_row_id", con."contributor_id" \
order by RANDOM() \
limit 5  returning "dataset_row_id") \
select ins."dataset_row_id", dataset_row.media ->> 'data' as sentence from ins  \
  inner join dataset_row on dataset_row."dataset_row_id" = ins."dataset_row_id";`

const updateAndGetUniqueMediaQuery = `\
INSERT INTO "contributors" ("user_name","contributor_identifier")  select $2, $1 \
where not exists \
(select "contributor_id" from "contributors" where "contributor_identifier" = $1 and user_name=$2); \
update "contributors" set "age_group" = $7, gender = $6, mother_tongue = $5 \
where contributor_identifier = $1 and user_name = $2; \
with ins ("dataset_row_id") as \
( insert into "contributions" ("action","dataset_row_id", "date", "contributed_by") \
select \'assigned\', dataset_row."dataset_row_id", now(), con."contributor_id" \
from dataset_row inner join "contributors" con on con."contributor_identifier" = $1 and user_name=$2 and coalesce(dataset_row.state,'')!= 'reported' \
left join "contributions" cont on cont."dataset_row_id"= dataset_row."dataset_row_id" \
where dataset_row."state" is null and language = $4 and difficulty_level=$3 and cont."action" is NULL limit 5 \
  returning "dataset_row_id") \
select ins."dataset_row_id", dataset_row.media ->> 'data' as sentence from ins  \
  inner join dataset_row on dataset_row."dataset_row_id" = ins."dataset_row_id";`

const getOrderedMediaQuery = `
select dataset_row."dataset_row_id", dataset_row.media ->> 'data' as media_data
from dataset_row 
left join "contributors" con on con."contributor_identifier"=$1 and user_name=$2
left join "contributions" cont on cont."dataset_row_id"= dataset_row."dataset_row_id" and cont.contributed_by = con.contributor_id 
where dataset_row.media ->> 'language'=$4 and difficulty_level=$3 and coalesce(dataset_row.state,'')!= 'reported' and type=$5
and (cont.action is null or (coalesce(cont.action,'')='completed' and cont.contributed_by != con.contributor_id) or (coalesce(cont.action,'')='skipped' and cont.contributed_by != con.contributor_id)) 
group by dataset_row."dataset_row_id", dataset_row.media ->> 'data' 
order by dataset_row."dataset_row_id"
limit 5`;

const getOrderedUniqueMediaQuery = `select dataset_row.dataset_row_id, dataset_row.media->>'data' as media_data, coalesce(dataset_row.media ->> 'collectionSource', mds.params ->> 'collectionSource') as source_info
from dataset_row 
left join master_dataset mds on dataset_row.master_dataset_id=mds.master_dataset_id
left join contributors con on con.contributor_identifier=$1 and user_name=$2 
left join contributions cont on cont.dataset_row_id=dataset_row.dataset_row_id and cont.contributed_by=con.contributor_id 
--inner join configurations conf on conf.config_name='include_profane' 
--inner join configurations conf2 on conf2.config_name='show_demo_data'
where dataset_row.media->>'language'=$4 and type=$5 and state is null
and (cont.action is null or (coalesce(cont.action,'')='skipped' and cont.contributed_by!=con.contributor_id)) 
and coalesce(mds.is_active, true) = true
and (is_profane=false)
--and (conf2.value=0 or for_demo=true)
--group by dataset_row.dataset_row_id, dataset_row.media->>'data', mds.params 
limit 5`;

const getOrderedUniqueMediaForParallel = `with existingData as 
(select con.dataset_row_id from contributions con 
 inner join dataset_row ds on con.dataset_Row_id=ds.dataset_row_id 
 where ds.type=$5 and ds.media->>'language'=$4 and con.media->>'language'=$6 and con.action='completed'),
 filteredDatasetRow as 
 (
 select * from dataset_row dr where dr.media->>'language'=$4 and type=$5
 )
 
select dr.dataset_row_id, dr.media->>'data' as media_data, null as source_info 
from filteredDatasetRow dr 
left join master_dataset mds on dr.master_dataset_id=mds.master_dataset_id
left join contributors con on con.contributor_identifier=$1 and user_name=$2
left join contributions cont on cont.dataset_row_id=dr.dataset_row_id and cont.contributed_by=con.contributor_id 
--left join configurations conf on conf.config_name='include_profane' 
--left join configurations conf2 on conf2.config_name='show_demo_data'
left join existingData ed on ed.dataset_row_id=dr.dataset_row_id
where (((state is null) or ((state='contributed' or state='validated') and ed.dataset_row_id is null)) 
and coalesce(mds.is_active, true) = true
  and (cont.action is null or (coalesce(cont.action,'')='skipped' and cont.contributed_by!=con.contributor_id)))
and (is_profane=false)
--and (conf2.value=0 or for_demo=true)
 --group by dr."dataset_row_id", dr.media->>'data', mds.params 
 limit 5`;

const getContributionListQuery = `
select con.contribution_id, con.dataset_row_id, ds.media->>'data' as sentence, con.media->>'data' as contribution, null as source_info, con.is_system auto_validate
from contributions con 
    inner join dataset_row ds on ds.dataset_row_id=con.dataset_row_id and con.contributed_by!=$1
	and ds.type=$2
    left join master_dataset mds on ds.master_dataset_id=mds.master_dataset_id
    where  con.action='completed' 
      and con.allow_validation=true
			and ds.media->>'language'=$3 
			and con.media->>'language'=$3
			and coalesce(mds.is_active, true) = true
			and (is_profane=false)
			--and (conf3.value=0 or for_demo=true)
 			and con.contribution_id not in 
			(select contribution_id from validations where action!='skip' group by contribution_id having count(1) > 4)
      and con.contribution_id not in (select contribution_id from validations where validated_by=$1)
	limit 5;`

const getContributionListForParallel = `
select con.contribution_id, con.dataset_row_id, ds.media->>'data' as sentence, con.media->>'data' as contribution, null as source_info, con.is_system auto_validate
from contributions con 
    inner join dataset_row ds on ds.dataset_row_id=con.dataset_row_id and con.contributed_by!=$1
	and ds.type=$2 and con.media->>'language'=$4
    left join master_dataset mds on ds.master_dataset_id=mds.master_dataset_id
    where  con.action='completed' 
      and con.allow_validation=true
			and ds.media->>'language'=$3
			and coalesce(mds.is_active, true) = true
			and (is_profane=false)
			--and (conf3.value=0 or for_demo=true)
 			and con.contribution_id not in 
			(select contribution_id from validations where action!='skip' group by contribution_id having count(1) > 4)
      and con.contribution_id not in (select contribution_id from validations where validated_by=$1)
	limit 5;`

const addValidationQuery = `insert into validations (contribution_id, action, validated_by, date, state_region, country, device, browser) 
select contribution_id, $3, $1, now(), $5, $6, $7, $8 from contributions inner join dataset_row on dataset_row.dataset_row_id=contributions.dataset_row_id 
where dataset_row.dataset_row_id=$2 and contribution_id=$4 and contributions.contributed_by != $1;`

const updateMediaWithValidatedState = `update dataset_row set state = 
'validated' where dataset_row_id = $1 and (select count(1) from validations where contribution_id=$2 and action!='skip') >= 
(select value from configurations where config_name = 'validation_count');`

const updateContributionDetails = `insert into contributions (action, dataset_row_id, date, contributed_by, state_region, country, media, device, browser)
select 'completed', $1, now(), $2, $6, $7, json_build_object('data', $3, 'type', 'audio', 'language', $4, 'duration', $5), $8, $9
  where (select count(1) from contributions where dataset_row_id=$1 and media ->> 'language' = $4 and action='completed') < 
 (select value from configurations where config_name = 'contribution_count');`;

const updateContributionDetailsWithUserInput = `insert into "contributions" ("action","dataset_row_id", "date", "contributed_by", "state_region", "country", "media", "device", "browser", "allow_validation")
select 'completed', $1, now(), $2, $5, $6, json_build_object('data', $3, 'type', 'text', 'language', $4), $7, $8, $9 
  where (select count(1) from contributions where dataset_row_id=$1 and media ->> 'language' = $4 and action='completed') < 
 (select value from configurations where config_name = 'contribution_count') returning contribution_id;`;

const updateMaterializedViews = 'REFRESH MATERIALIZED VIEW contributions_and_demo_stats;REFRESH MATERIALIZED VIEW daily_stats_complete;REFRESH MATERIALIZED VIEW gender_group_contributions;REFRESH MATERIALIZED VIEW age_group_contributions;REFRESH MATERIALIZED VIEW language_group_contributions;REFRESH MATERIALIZED VIEW state_group_contributions;REFRESH MATERIALIZED VIEW language_and_state_group_contributions;'

const updateViews = 'CALL update_view_data();';

const updateMediaWithContributedState = `update dataset_row set state='contributed' where "dataset_row_id"=$1 and state is null`;

const feedbackInsertion = 'Insert into feedbacks (email, feedback, category, language, module, target_page, opinion_rating, recommended, revisit) values ($1,$2,$3,$4,$5,$6,$7,$8,$9);'

const saveReportQuery = `
INSERT INTO reports (reported_by, media_id, report_text, language,source) \
SELECT $1,$2,$3,$4,$5`;

const markContributionReported = "update contributions set action='reported' where contribution_id=$3 and (select count(distinct reported_by) from reports where source='validation' and media_id=$3 group by media_id) >= (select value from configurations where config_name='audio_report_limit');";

const markMediaReported = `update dataset_row set state='reported' where "dataset_row_id"=$3 and (select count(distinct reported_by) from reports where source='contribution' and media_id=$3 group by media_id) >= (select value from configurations where config_name='sentence_report_limit');`;

const markContributionSkippedQuery = `insert into contributions (action, dataset_row_id, date, contributed_by, media, state_region, country, device, browser)
select 'skipped', $2, now(), $1, json_build_object('language', $3), $4, $5, $6, $7;`;

const rewardsInfoQuery = `select milestone as contributions, grade as badge from reward_milestones mil
inner join reward_catalogue rew on mil.reward_catalogue_id=rew.id
where mil.type=$1 and category=$2 and LOWER(language)=LOWER($3) order by mil.milestone`;

const getTotalUserContribution = `select count(1) from contributions con 
inner join dataset_row dr on dr.dataset_row_id=con.dataset_row_id where dr.type=$3 and LOWER(dr.media->>'language') = LOWER($2) 
and action = 'completed' and con.contributed_by = $1`;

const getTotalUserValidation = `select count(1) from validations val 
inner join contributions con on val.contribution_id=con.contribution_id and val.action!='skip' 
inner join dataset_row dr on dr.dataset_row_id=con.dataset_row_id where dr.type=$3 and LOWER(dr.media->>'language')=LOWER($2) 
and val.validated_by=$1`;

const checkCurrentMilestoneQuery = `select grade, reward_milestone.milestone, reward_milestone.milestone_id from reward_catalogue, 
(select milestone, milestone_id, reward_catalogue_id as rid from reward_milestones where milestone <= $1 
and LOWER(language) = LOWER($2) and type=$3 and category=$4 order by milestone desc limit 1) 
as reward_milestone where id=reward_milestone.rid`;

const checkNextMilestoneQuery = `select grade, reward_milestone.milestone from reward_catalogue, 
(select milestone, milestone_id, reward_catalogue_id as rid from reward_milestones where milestone > $1 
and language=$2 and category=$3 and type=$4 order by milestone limit 1) 
as reward_milestone where id=reward_milestone.rid and grade is not null`;

const findRewardInfo = `select re.milestone_id, rc.grade, generated_badge_id 
from rewards re inner join reward_milestones rm on re.milestone_id=rm.milestone_id and type=$4 and language=$2 and category=$3
inner join reward_catalogue rc on rc.id=rm.reward_catalogue_id 
where contributor_id=$1`;

const insertRewardQuery = `insert into rewards (contributor_id, milestone_id) 
select $1, $2 where not exists (select 1 from rewards where contributor_id=$1 and milestone_id=$2) returning generated_badge_id`;

const getValidationCountQuery = 'select count(*) from validations where contribution_id = $1 and action != \'skip\'';

const addContributorIfNotExistQuery = `INSERT INTO "contributors" ("user_name","contributor_identifier","age_group","gender","mother_tongue")
select $2, $1, $3, $4, $5 
ON CONFLICT("user_name", "contributor_identifier") 
DO UPDATE SET user_name=$2 RETURNING contributor_id;`;

const getBadges = `select grade, reward_milestone.milestone, id from reward_catalogue, 
(select milestone,reward_catalogue_id as rid from reward_milestones where milestone <= $1 
and LOWER(language) = LOWER($2) order by milestone desc) 
as reward_milestone where id=reward_milestone.rid`;

const getContributionHoursForLanguage = `select COALESCE(sum((con.media->>'duration')::decimal/3600), 0) as hours from contributions con 
inner join dataset_row dr on dr."dataset_row_id"=con."dataset_row_id" where LOWER(dr.media->>'language') = LOWER($1) 
and action = 'completed' and (con.media->>'duration') is not null`;

const getContributionLanguagesQuery = `select dr.media->>'language' as from_language,con.media->>'language' as to_language from dataset_row dr inner join 
contributions con on con.dataset_row_id=dr.dataset_row_id and con.action='completed' where dr.type=$1 group by dr.media->>'language',con.media->>'language',dr.type`;

const getDataRowInfo = `select type, media->>'language' as language from dataset_row where dataset_row_id=$1`;

const userVerifyQuery = `select id from users where LOWER(username) = LOWER($1) and role = $2`;

const getUserRewardsQuery = `select r.generated_at, r.generated_badge_id, rm.language, rm.milestone, rm.type, rm.category, rc.grade 
  from rewards r
  inner join reward_milestones rm on r.milestone_id = rm.milestone_id
  inner join reward_catalogue rc on rm.reward_catalogue_id=rc.id
  where contributor_id=$1 order by r.generated_at desc, rm.milestone desc`;

module.exports = {
  userVerifyQuery,
  unassignIncompleteMedia,
  unassignIncompleteMediaWhenLanChange,
  mediaCount,
  updateAndGetMediaQuery,
  updateAndGetUniqueMediaQuery,
  updateAndGetOrderedMediaQuery,
  getOrderedMediaQuery,
  getOrderedUniqueMediaQuery,
  getOrderedUniqueMediaForParallel,
  getContributionListQuery,
  getContributionListForParallel,
  updateContributionDetails,
  updateMediaWithContributedState,
  addValidationQuery,
  updateMediaWithValidatedState,
  feedbackInsertion,
  saveReportQuery,
  getMediaForLaunch,
  markContributionSkippedQuery,
  rewardsInfoQuery,
  getTotalUserContribution,
  getTotalUserValidation,
  findRewardInfo,
  insertRewardQuery,
  checkCurrentMilestoneQuery,
  checkNextMilestoneQuery,
  markMediaReported,
  markContributionReported,
  updateMaterializedViews,
  updateViews,
  getValidationCountQuery,
  getBadges,
  addContributorIfNotExistQuery,
  getContributionHoursForLanguage,
  updateContributionDetailsWithUserInput,
  getContributionLanguagesQuery,
  getDataRowInfo,
  getUserRewardsQuery
}
