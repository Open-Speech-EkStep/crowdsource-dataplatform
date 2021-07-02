ALTER TABLE public.dataset_row
    ADD COLUMN for_demo boolean DEFAULT false;

/* Replace with your SQL commands */
insert into configurations(config_name,value,updated_at,updated_by) values ('show_demo_data',0,now(),'Admin')