ALTER TABLE "contributions"
    ADD COLUMN audio_duration double precision;

UPDATE "contributions" SET audio_duration = 6
    WHERE audio_path IS NOT NULL;