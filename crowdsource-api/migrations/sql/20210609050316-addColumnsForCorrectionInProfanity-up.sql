/* Replace with your SQL commands */ 

alter table dataset_row add column IF NOT EXISTS correction boolean;

alter table dataset_row add column IF NOT EXISTS correction_user text default '';

alter table dataset_row add column IF NOT EXISTS assigned_correction boolean default false;


