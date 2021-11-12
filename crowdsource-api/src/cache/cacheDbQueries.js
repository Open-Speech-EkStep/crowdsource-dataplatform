const getContributionDataForCaching = `select dataset_row.dataset_row_id, dataset_row.media->>'data' as media_data, null as source_info, string_agg(con.contributor_identifier::text || '-' || con.user_name, ', ') as skipped_by
from dataset_row
left join master_dataset mds on dataset_row.master_dataset_id=mds.master_dataset_id
left join contributions c on dataset_row.dataset_row_id=c.dataset_row_id and c.action = 'skipped'
left join contributors con on c.contributed_by=con.contributor_id
inner join configurations conf on conf.config_name='include_profane' 
inner join configurations conf2 on conf2.config_name='show_demo_data'
where type=$1 and dataset_row.media->>'language'=$2 and state is null
and coalesce(mds.is_active, true) = true
and (conf.value=1 or is_profane=false)
and (conf2.value=0 or for_demo=true)
group by dataset_row.dataset_row_id, dataset_row.media->>'data'
limit $4;`;

const getParallelContributionDataForCaching = `with existingData as 
(select con.dataset_row_id from contributions con 
 inner join dataset_row ds on con.dataset_Row_id=ds.dataset_row_id 
 where ds.type=$1 and ds.media->>'language'=$2 and con.media->>'language'=$3 and con.action='completed'),
 filteredDatasetRow as 
 (
 select * from dataset_row dr where dr.media->>'language'=$2 and type=$1
 )
 
select dr.dataset_row_id, dr.media->>'data' as media_data, null as source_info, string_agg(con.contributor_identifier::text || '-' || con.user_name, ', ') as skipped_by 
from filteredDatasetRow dr 
left join master_dataset mds on dr.master_dataset_id=mds.master_dataset_id
left join existingData ed on ed.dataset_row_id=dr.dataset_row_id
left join contributions cont on cont.dataset_row_id=dr.dataset_row_id and cont.action='skipped'
left join contributors con on con.contributor_id=cont.contributed_by
left join configurations conf on conf.config_name='include_profane' 
left join configurations conf2 on conf2.config_name='show_demo_data'
where ((state is null) or ((state='contributed' or state='validated') and ed.dataset_row_id is null)) 
and coalesce(mds.is_active, true) = true
 and (conf.value=1 or is_profane=false)
 and (conf2.value=0 or for_demo=true)
  group by dr."dataset_row_id", dr.media->>'data' limit $4;`;

const getValidationDataForCaching = `select con.dataset_row_id, ds.media->>'data' as sentence, con.media->>'data' as contribution, con.contribution_id, null as source_info, 
cont.contributor_identifier::text || '-' || cont.user_name as contributed_by, string_agg(cont2.contributor_identifier::text || '-' || cont2.user_name, ', ') as skipped_by,
count(distinct val.validation_id) as validation_count, con.is_system auto_validate
    from contributions con 
    inner join dataset_row ds on ds.dataset_row_id=con.dataset_row_id 
	and ds.type=$1 and con.media->>'language'=$2 and ds.state <> 'validated'
	inner join contributors cont on con.contributed_by=cont.contributor_id
  left join master_dataset mds on ds.master_dataset_id=mds.master_dataset_id
  	left join validations val2 on val2.contribution_id=con.contribution_id
	left join contributors cont2 on val2.validated_by=cont2.contributor_id
    left join validations val on val.contribution_id=con.contribution_id and val.action!='skip' 
	inner join configurations conf on conf.config_name='validation_count' 
  inner join configurations conf2 on conf2.config_name='include_profane' 
  inner join configurations conf3 on conf3.config_name='show_demo_data'
    where  con.action='completed' and ds.media->>'language'=$2
    and coalesce(mds.is_active, true) = true
    and (conf2.value=1 or is_profane=false)
    and (conf3.value=0 or for_demo=true)
	group by con.dataset_row_id, ds.media->>'data', con.contribution_id, conf.value, cont.contributor_identifier, cont.user_name
	having count(distinct val.validation_id)<conf.value
    order by count(val.*) desc
	limit $4;`;

const getParallelValidationDataForCaching = `select con.dataset_row_id, ds.media->>'data' as sentence, con.media->>'data' as contribution, con.contribution_id, null as source_info, 
cont.contributor_identifier::text || '-' || cont.user_name as contributed_by, string_agg(cont2.contributor_identifier::text || '-' || cont2.user_name, ', ') as skipped_by, 
count(distinct val.validation_id) validation_count, con.is_system auto_validate
  from contributions con 
  inner join dataset_row ds on ds.dataset_row_id=con.dataset_row_id and ds.type='parallel' and con.media->>'language'=$3
  left join master_dataset mds on ds.master_dataset_id=mds.master_dataset_id
  inner join contributors cont on con.contributed_by=cont.contributor_id
  left join validations val2 on val2.contribution_id=con.contribution_id
  left join contributors cont2 on val2.validated_by=cont2.contributor_id
  left join validations val on val.contribution_id=con.contribution_id and val.action!='skip'
  inner join configurations conf on conf.config_name='validation_count' 
  inner join configurations conf2 on conf2.config_name='include_profane' 
  inner join configurations conf3 on conf3.config_name='show_demo_data'
  where  con.action='completed' and ds.media->>'language'=$2
  and coalesce(mds.is_active, true) = true
  and (conf2.value=1 or is_profane=false) 
  and (conf3.value=0 or for_demo=true)
  group by con.dataset_row_id, ds.media->>'data', con.media->>'data', con.contribution_id, conf.value, cont.contributor_identifier, cont.user_name
  having count(distinct val.validation_id)<conf.value
  limit $4;`;

module.exports = {
  getContributionDataForCaching,
  getParallelContributionDataForCaching,
  getValidationDataForCaching,
  getParallelValidationDataForCaching
}
