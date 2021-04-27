insert into "contributors" (
contributor_identifier,user_name)
select s."userId", s."userName" from "sentences" s
where s."userId" is not NULL
group by s."userId", s."userName";



update contributors con set mother_tongue = sen."motherTongue"
from sentences sen
where con.contributor_identifier = sen."userId" and con.user_name = sen."userName" and sen."motherTongue" is not null;

update contributors con set gender = sen.gender
from sentences sen
where con.contributor_identifier = sen."userId" and con.user_name = sen."userName" and sen.gender is not null;


update contributors con set age_group = sen."ageGroup"
from sentences sen
where con.contributor_identifier = sen."userId" and con.user_name = sen."userName" and sen."ageGroup" is not null;