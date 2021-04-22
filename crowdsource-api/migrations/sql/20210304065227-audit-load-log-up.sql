CREATE TABLE IF NOT EXISTS audit_load_log (
  id serial not null,
  tablename varchar(100),
  username varchar(100),
  command varchar(100),
  lastupdated timestamp default current_timestamp
);