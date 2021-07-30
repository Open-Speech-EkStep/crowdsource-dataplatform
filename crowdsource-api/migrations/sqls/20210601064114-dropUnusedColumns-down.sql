/* Replace with your SQL commands */
ALTER TABLE "dataset_row" ADD COLUMN "sentence" text;

ALTER TABLE "dataset_row" ADD COLUMN "language" text;

ALTER TABLE "contributions" ADD COLUMN "audio_path" text;

ALTER TABLE "contributions" ADD COLUMN "audio_duration" double precision;