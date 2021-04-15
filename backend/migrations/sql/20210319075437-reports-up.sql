/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS reports (
  id serial not null,
  reported_by integer NOT NULL,
  sentence_id integer NOT NULL,
  language varchar(100),
  report_text text COLLATE pg_catalog."default" NOT NULL,
  reported_at timestamp default current_timestamp
);