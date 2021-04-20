
ALTER TABLE public.sentences
    ADD COLUMN type text NOT NULL DEFAULT 'text';

ALTER TABLE public.sentences
    ADD COLUMN media jsonb;

ALTER TABLE public.sentences
    ADD COLUMN difficulty_level text NOT NULL 'medium';

update sentences set difficulty_level=label, type='text', media = json_build_object('data', sentence, 'type', 'text', 'language', language);
