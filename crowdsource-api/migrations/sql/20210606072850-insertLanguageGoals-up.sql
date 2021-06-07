/* Replace with your SQL commands */
insert into language_goals(language,goal,type,category) select language,goal,type,'validate' from language_goals where type='text';

insert into language_goals(language,goal,type,category) select language,goal,'asr',category from language_goals where type='text';

insert into language_goals(language,goal,type,category) select language,10000,'ocr',category from language_goals where type='text';

insert into language_goals(language,goal,type,category) select language,10000,'parallel',category from language_goals where type='text';
