--Clean all data

delete from validations where contribution_id in (
select contribution_id from contributions where dataset_row_id in (
select dataset_row_id from dataset_row where (type='asr' or type='ocr') and (media->> 'language'='Malayalam' or media->> 'language'='Telugu' or media->> 'language'='Odia' or media->> 'language'='Kannada'))
);

delete from contributions where dataset_row_id in (
select dataset_row_id from dataset_row where (type='asr' or type='ocr') and (media->> 'language'='Malayalam' or media->> 'language'='Telugu' or media->> 'language'='Odia' or media->> 'language'='Kannada')
);

delete from dataset_row where (type='asr' or type='ocr') and (media->> 'language'='Malayalam' or media->> 'language'='Telugu' or media->> 'language'='Odia' or media->> 'language'='Kannada');

delete from validations where contribution_id in (
select contribution_id from contributions where dataset_row_id in (
select dataset_row_id from dataset_row where (type='parallel') and (media->> 'language'='Odia'))
);

delete from contributions where dataset_row_id in (
select dataset_row_id from dataset_row where (type='parallel') and (media->> 'language'='Odia')
);

delete from dataset_row where (type='parallel') and (media->> 'language'='Odia');


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
            "language": "Telugu"
            }'::jsonb, 'contributed'
union all
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Telugu"
            }'::jsonb, 'contributed'
union all
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Kannada"
            }'::jsonb, null
union all
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Kannada"
            }'::jsonb, null
union all
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Kannada"
            }'::jsonb, null
union all
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Kannada"
            }'::jsonb, null
union all
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Kannada"
            }'::jsonb, null
union all
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Kannada"
            }'::jsonb, null
union all
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Kannada"
            }'::jsonb, 'contributed'
union all
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Kannada"
            }'::jsonb, 'contributed'
union all
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Kannada"
            }'::jsonb, 'contributed';


insert into contributions 
    ( dataset_row_id, contributed_by, media, is_system , date, action) 
select dataset_row_id, (select contributor_id from contributors where user_name='##system##'), '{
            "data": "హలో మీరు ఈ రోజు ఎలా ఉన్నారు",
            "type": "text",
            "language": "Telugu"
            }'::jsonb, true, now(), 'completed' from dataset_row where type='asr' and media ->> 'language'='Telugu'
union all
select dataset_row_id, (select contributor_id from contributors where user_name='##system##'), '{
            "data": "ಹಲೋ ನೀವು ಇಂದು ಹೇಗೆ ಮಾಡುತ್ತಿದ್ದೀರಿ",
            "type": "text",
            "language": "Kannada"
            }'::jsonb, true, now(), 'completed' from dataset_row where type='asr' and media ->> 'language'='Kannada' and state='contributed';

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
            "language": "Telugu"
            }'::jsonb, 'contributed'
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image2.png",
            "type": "image",
            "language": "Telugu"
            }'::jsonb, 'contributed'
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image1.png",
            "type": "image",
            "language": "Kannada"
            }'::jsonb, null
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image2.png",
            "type": "image",
            "language": "Kannada"
            }'::jsonb, null
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image1.png",
            "type": "image",
            "language": "Kannada"
            }'::jsonb, null
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image2.png",
            "type": "image",
            "language": "Kannada"
            }'::jsonb, null
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image1.png",
            "type": "image",
            "language": "Kannada"
            }'::jsonb, null
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image2.png",
            "type": "image",
            "language": "Kannada"
            }'::jsonb, null
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image2.png",
            "type": "image",
            "language": "Kannada"
            }'::jsonb, 'contributed'
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image1.png",
            "type": "image",
            "language": "Kannada"
            }'::jsonb, 'contributed'
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image2.png",
            "type": "image",
            "language": "Kannada"
            }'::jsonb, 'contributed';

insert into contributions 
    ( dataset_row_id, contributed_by, media, is_system , date, action) 
select dataset_row_id, (select contributor_id from contributors where user_name='##system##'), '{
            "data": "హలో మీరు ఈ రోజు ఎలా ఉన్నారు",
            "type": "text",
            "language": "Telugu"
            }'::jsonb, true, now(), 'completed' from dataset_row where type='ocr' and media ->> 'language'='Telugu'
union all
select dataset_row_id, (select contributor_id from contributors where user_name='##system##'), '{
            "data": "ಹಲೋ ನೀವು ಇಂದು ಹೇಗೆ ಮಾಡುತ್ತಿದ್ದೀರಿ",
            "type": "text",
            "language": "Kannada"
            }'::jsonb, true, now(), 'completed' from dataset_row where type='ocr' and media ->> 'language'='Kannada' and state='contributed';



-- delete parallel data

delete from validations where contribution_id in (
select contribution_id from contributions where dataset_row_id in (
select dataset_row_id from dataset_row where (type='parallel') and (media->> 'language'='Odia'))
);

delete from contributions where dataset_row_id in (
select dataset_row_id from dataset_row where (type='parallel') and (media->> 'language'='Odia')
);

delete from dataset_row where (type='parallel') and (media->> 'language'='Odia');


-- parallel data

insert into dataset_row 
    ( difficulty_level, type, media, state ) 
select 'medium', 'parallel', '{
            "data": "କେମିତି ଅଛନ୍ତି, କେମିତି ଅଛ",
            "type": "text",
            "language": "Odia"
            }'::jsonb, null
union all
select 'medium', 'parallel', '{
            "data": "ଆଶାକରେ ତୁମେ ଭଲ ଅଛ",
            "type": "text",
            "language": "Odia"
            }'::jsonb, null
union all
select 'medium', 'parallel', '{
            "data": "ଆପଣ କେଉଁଠାରେ ବାସ କରନ୍ତି",
            "type": "text",
            "language": "Odia"
            }'::jsonb, null
union all
select 'medium', 'parallel', '{
            "data": "ବର୍ତ୍ତମାନ ସମୟ କ’ଣ? ",
            "type": "text",
            "language": "Odia"
            }'::jsonb, null
union all
select 'medium', 'parallel', '{
            "data": "ମୁଁ ଆଜି ବହୁତ ଖୁସି ",
            "type": "text",
            "language": "Odia"
            }'::jsonb, null
union all
select 'medium', 'parallel', '{
            "data": "କେତେବେଳେ ବର୍ଷା ହେବ ",
            "type": "text",
            "language": "Odia"
            }'::jsonb, null ;


--- Profanity Data

Delete from dataset_row where media->> 'language' = 'English' and type = 'text';

insert into dataset_row ( difficulty_level, type, media, state ) 
values('medium', 'text', '{
    "data": "I think that is what we all look for as an audience.",
    "type": "text",
    "language": "English"
}'::jsonb, null)
Union values('medium', 'text', '{
    "data": "The Kunchikal falls is the highest waterfalls in India",
    "type": "text",
    "language": "English"
}'::jsonb, null)

Union values('medium', 'text', '{
    "data": "A few cars allow users to unlock using their smartphones",
    "type": "text",
    "language": "English"
}'::jsonb, null)
Union values('medium', 'text', '{
    "data": "A number of folk songs associated with this festival have been popularized across generations.",
    "type": "text",
    "language": "English"
}'::jsonb, null)
Union values('medium', 'text', '{
    "data": "Himalayas are a young fold mountain range",
    "type": "text",
    "language": "English"
}'::jsonb, null);


-- insert into dataset_row ( difficulty_level, type, media, state ) 
-- values('medium', 'parallel', '{
--     "data": "This organisation is very helpful to students who are preparing for competitive exams",
--     "type": "text",
--     "language": "English"
-- }'::jsonb, null);


-- insert into dataset_row ( difficulty_level, type, media, state ) 
-- values('medium', 'ocr', '{
--     "data": "inbound/ocr/English/english/ead846f9-2f36-417e-9b37-36ba83074026.png",
--     "type": "image",
--     "language": "English"
-- }'::jsonb, null);


-- insert into dataset_row ( difficulty_level, type, media, state ) 
-- values('medium', 'asr', '{
--     "data": "automationTestData/asr/testing url/0_7_1481file-idQNBJvgvyfuU?;,?:@&=+$.wav",
--     "type": "audio",
--     "language": "English"
-- }'::jsonb, null);