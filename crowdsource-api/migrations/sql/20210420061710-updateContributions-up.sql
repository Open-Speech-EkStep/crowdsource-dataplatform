
ALTER TABLE public.contributions
    ADD COLUMN media jsonb;


UPDATE contributions AS c 
SET media = json_build_object('data', c.audio_path, 'type', 'audio', 'language', s.language, 'duration', c.audio_duration)
FROM sentences AS s
WHERE s."sentenceId" = c."sentenceId"  and c.action='completed';