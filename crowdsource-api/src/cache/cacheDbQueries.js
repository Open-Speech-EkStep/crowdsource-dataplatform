const getContributionDataForCaching = `select dataset_row.dataset_row_id, dataset_row.media->>'data' as media_data, null as source_info, string_agg(con.contributor_identifier::text || '-' || con.user_name, ', ') as skipped_by
from dataset_row
left join contributions c on dataset_row.dataset_row_id=c.dataset_row_id and c.action = 'skipped'
left join contributors con on c.contributed_by=con.contributor_id
inner join configurations conf on conf.config_name='include_profane' 
inner join configurations conf2 on conf2.config_name='show_demo_data'
where type=$1 and dataset_row.media->>'language'=$2 and (type != 'parallel' or state is null) 
and (conf.value=1 or is_profane=false)
and (conf2.value=0 or for_demo=true)
group by dataset_row.dataset_row_id, dataset_row.media->>'data'
limit 10000;`;

module.exports = {
  getContributionDataForCaching
}
