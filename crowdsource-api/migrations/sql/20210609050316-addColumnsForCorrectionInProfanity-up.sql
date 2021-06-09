/* Replace with your SQL commands */ 

alter table dataset_row add column correction boolean;

alter table dataset_row add column correction_user text default '';

alter table dataset_row add column assigned_correction boolean default false;


