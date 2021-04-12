with src as (
	select sen."sentenceId"
	from sentences sen
	inner join contributions con on sen."sentenceId" = con."sentenceId" and sen.state='contributed'
	inner join validations val on con.contribution_id=val.contribution_id  and val.action != 'skip' 
	group by sen."sentenceId"
	having count(con.*)>=(select value from configurations where config_name='validation_count')
)
update sentences set state='validated'
from src
where src."sentenceId" = sentences."sentenceId";