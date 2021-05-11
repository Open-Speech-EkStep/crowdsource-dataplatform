/* Replace with your SQL commands */
update configurations set value=5 where config_name='validation_count';

insert into configurations(config_name, value, updated_by) values ('contribution_count', 3 , 'Admin');