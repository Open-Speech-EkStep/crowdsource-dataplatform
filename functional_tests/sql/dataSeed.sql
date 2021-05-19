--Clean all data

delete from validations where contribution_id in (
select contribution_id from contributions where dataset_row_id in (
select dataset_row_id from dataset_row where (type='asr' or type='ocr') and (media->> 'language'='Malayalam' or media->> 'language'='Bengali' or media->> 'language'='Odia' or media->> 'language'='Marathi'))
);

delete from contributions where dataset_row_id in (
select dataset_row_id from dataset_row where (type='asr' or type='ocr') and (media->> 'language'='Malayalam' or media->> 'language'='Bengali' or media->> 'language'='Odia' or media->> 'language'='Marathi')
);

delete from dataset_row where (type='asr' or type='ocr') and (media->> 'language'='Malayalam' or media->> 'language'='Bengali' or media->> 'language'='Odia' or media->> 'language'='Marathi');

--ASR data

insert into dataset_row 
    ( difficulty_level, type, media, state ) 
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Odia"
            }'::jsonb, null
union all
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Odia"
            }'::jsonb, null
union all
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Bengali"
            }'::jsonb, 'contributed'
union all
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Bengali"
            }'::jsonb, 'contributed'
union all
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Marathi"
            }'::jsonb, null
union all
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Marathi"
            }'::jsonb, null
union all
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Marathi"
            }'::jsonb, null
union all
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Marathi"
            }'::jsonb, null
union all
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Marathi"
            }'::jsonb, null
union all
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Marathi"
            }'::jsonb, null
union all
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Marathi"
            }'::jsonb, 'contributed'
union all
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Marathi"
            }'::jsonb, 'contributed'
union all
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Marathi"
            }'::jsonb, 'contributed';


insert into contributions 
    ( dataset_row_id, contributed_by, media, is_system , date, action) 
select dataset_row_id, (select contributor_id from contributors where user_name='##system##'), '{
            "data": "হলো হাউ অরে ইউ ডিং টুডে ",
            "type": "text",
            "language": "Bengali"
            }'::jsonb, true, now(), 'completed' from dataset_row where type='asr' and media ->> 'language'='Bengali'
union all
select dataset_row_id, (select contributor_id from contributors where user_name='##system##'), '{
            "data": "नमस्कार काय चाललं आहे आज",
            "type": "text",
            "language": "Marathi"
            }'::jsonb, true, now(), 'completed' from dataset_row where type='asr' and media ->> 'language'='Marathi' and state='contributed';


--OCR data

insert into dataset_row 
    ( difficulty_level, type, media, state ) 
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image1.png",
            "type": "image",
            "language": "Odia"
            }'::jsonb, null
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image2.png",
            "type": "image",
            "language": "Odia"
            }'::jsonb, null
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image1.png",
            "type": "image",
            "language": "Bengali"
            }'::jsonb, 'contributed'
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image2.png",
            "type": "image",
            "language": "Bengali"
            }'::jsonb, 'contributed'
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image1.png",
            "type": "image",
            "language": "Marathi"
            }'::jsonb, null
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image2.png",
            "type": "image",
            "language": "Marathi"
            }'::jsonb, null
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image1.png",
            "type": "image",
            "language": "Marathi"
            }'::jsonb, null
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image2.png",
            "type": "image",
            "language": "Marathi"
            }'::jsonb, null
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image1.png",
            "type": "image",
            "language": "Marathi"
            }'::jsonb, null
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image2.png",
            "type": "image",
            "language": "Marathi"
            }'::jsonb, null
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image2.png",
            "type": "image",
            "language": "Marathi"
            }'::jsonb, 'contributed'
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image1.png",
            "type": "image",
            "language": "Marathi"
            }'::jsonb, 'contributed'
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image2.png",
            "type": "image",
            "language": "Marathi"
            }'::jsonb, 'contributed';


insert into contributions 
    ( dataset_row_id, contributed_by, media, is_system , date, action) 
select dataset_row_id, (select contributor_id from contributors where user_name='##system##'), '{
            "data": "হলো হাউ অরে ইউ ডিং টুডে ",
            "type": "text",
            "language": "Bengali"
            }'::jsonb, true, now(), 'completed' from dataset_row where type='ocr' and media ->> 'language'='Bengali'
union all
select dataset_row_id, (select contributor_id from contributors where user_name='##system##'), '{
            "data": "नमस्कार काय चाललं आहे आज",
            "type": "text",
            "language": "Marathi"
            }'::jsonb, true, now(), 'completed' from dataset_row where type='ocr' and media ->> 'language'='Marathi' and state='contributed';




