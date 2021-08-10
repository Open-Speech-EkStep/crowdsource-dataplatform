

insert into master_dataset (params, location, is_active)
select '{"collectionSource": null}', 'testMDSLocation5', true
where not exists (
	select 1 from master_dataset where location='testMDSLocation5'
);

insert into dataset_row 
    ( difficulty_level, type, media, state, is_profane, master_dataset_id ) 
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Odia"
            }'::jsonb, 'contributed', false, (select master_dataset_id from master_dataset where location='testMDSLocation5')
union all
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Odia"
            }'::jsonb, null, false, (select master_dataset_id from master_dataset where location='testMDSLocation5')
union all
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Kannada",
            "collectionSource": ["some source", "https://google.com/abcd/efg/hijk/lmnop"]
            }'::jsonb, null, false, null
union all
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Kannada",
            "collectionSource": ["some source", "https://google.com/abcd/efg/hijk/lmnop"]
            }'::jsonb, 'contributed', false, null;
			
insert into contributions 
    ( dataset_row_id, contributed_by, media, is_system , date, action) 
select dataset_row_id, (select contributor_id from contributors where user_name='##system##'), '{
            "data": "హలో మీరు ఈ రోజు ఎలా ఉన్నారు",
            "type": "text",
            "language": "Odia"
            }'::jsonb, true, now(), 'completed' from dataset_row where type='asr' and media ->> 'language'='Odia' and state='contributed'
union all
select dataset_row_id, (select contributor_id from contributors where user_name='##system##'), '{
            "data": "ಹಲೋ ನೀವು ಇಂದು ಹೇಗೆ ಮಾಡುತ್ತಿದ್ದೀರಿ",
            "type": "text",
            "language": "Kannada"
            }'::jsonb, true, now(), 'completed' from dataset_row where type='asr' and media ->> 'language'='Kannada' and state='contributed';
			
insert into dataset_row 
    ( difficulty_level, type, media, state, is_profane, master_dataset_id ) 
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image1.png",
            "type": "image",
            "language": "Odia"
            }'::jsonb, null, false, CAST(NULL AS INTEGER)
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image2.png",
            "type": "image",
            "language": "Odia"
            }'::jsonb, 'contributed', false, CAST(NULL AS INTEGER)
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image1.png",
            "type": "image",
            "language": "Kannada"
            }'::jsonb, null, false, CAST(NULL AS INTEGER)
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image1.png",
            "type": "image",
            "language": "Kannada"
            }'::jsonb, 'contributed', false, CAST(NULL AS INTEGER) ;
			
insert into contributions 
    ( dataset_row_id, contributed_by, media, is_system , date, action) 
select dataset_row_id, (select contributor_id from contributors where user_name='##system##'), '{
            "data": "హలో మీరు ఈ రోజు ఎలా ఉన్నారు",
            "type": "text",
            "language": "Odia"
            }'::jsonb, true, now(), 'completed' from dataset_row where type='ocr' and media ->> 'language'='Odia' and state='contributed'
union all
select dataset_row_id, (select contributor_id from contributors where user_name='##system##'), '{
            "data": "ಹಲೋ ನೀವು ಇಂದು ಹೇಗೆ ಮಾಡುತ್ತಿದ್ದೀರಿ",
            "type": "text",
            "language": "Kannada"
            }'::jsonb, true, now(), 'completed' from dataset_row where type='ocr' and media ->> 'language'='Kannada' and state='contributed';
			
insert into dataset_row 
    ( difficulty_level, type, media, state,is_profane ) 
select 'medium', 'parallel', '{
            "data": "କେମିତି ଅଛନ୍ତି, କେମିତି ଅଛ",
            "type": "text",
            "language": "Odia"
            }'::jsonb, null, false
union all
select 'medium', 'parallel', '{
            "data": "ଆଶାକରେ ତୁମେ ଭଲ ଅଛ",
            "type": "text",
            "language": "Odia"
            }'::jsonb, 'contributed', false;
			
insert into contributions 
    ( dataset_row_id, contributed_by, media, is_system , date, action) 
select dataset_row_id, (select contributor_id from contributors where user_name='##system##'), '{
            "data": "English",
            "type": "text",
            "language": "English"
            }'::jsonb, true, now(), 'completed' from dataset_row where type='parallel' and media ->> 'language'='Odia' and state='contributed'
