/* Replace with your SQL commands */
alter table dataset_row drop column IF EXISTS correction;

alter table dataset_row drop column IF EXISTS correction_user;

alter table dataset_row drop column IF EXISTS assigned_correction;