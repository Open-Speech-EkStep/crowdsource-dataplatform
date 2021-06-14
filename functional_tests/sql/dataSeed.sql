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


--- Profanity Data for dekho india

Delete from dataset_row where media->> 'language' = 'English' and type = 'ocr';


insert into dataset_row ( difficulty_level, type, media, state ) 
values('medium', 'ocr', '{
    "data": "inbound/ocr/English/english/7d94feac-906d-4509-9356-52913a95ce6d.png",
    "type": "image",
    "language": "English"
}'::jsonb, null)
Union values('medium', 'ocr', '{
    "data": "inbound/ocr/English/english/1de3987d-bed5-43f3-81b7-cc57343f4942.png",
    "type": "image",
    "language": "English"
}'::jsonb, null)
Union values('medium', 'ocr', '{
    "data": "inbound/ocr/English/english/6d1f5533-8af8-4521-9cdb-6267142bc305.png",
    "type": "image",
    "language": "English"
}'::jsonb, null)
Union values('medium', 'ocr', '{
    "data": "inbound/ocr/English/english/8fcf383a-482d-49d7-9f81-76ef5fd8c8fa.png",
    "type": "image",
    "language": "English"
}'::jsonb, null)
Union values('medium', 'ocr', '{
    "data": "inbound/ocr/English/english/81ed501d-173f-45dd-998f-f2d1eb0f23b7.png",
    "type": "image",
    "language": "English"
}'::jsonb, null)
Union values('medium', 'ocr', '{
    "data": "inbound/ocr/English/english/8c207032-ab11-4a2c-8f2d-eb6e7ba892d4.png",
    "type": "image",
    "language": "English"
}'::jsonb, null)
Union values('medium', 'ocr', '{
    "data": "inbound/ocr/English/english/23bd1906-6d77-4960-864f-643a9e619f79.png",
    "type": "image",
    "language": "English"
}'::jsonb, null)
Union values('medium', 'ocr', '{
    "data": "inbound/ocr/English/english/0ba7d741-7373-4fa8-ac40-6bc791d08a88.png",
    "type": "image",
    "language": "English"
}'::jsonb, null)
Union values('medium', 'ocr', '{
    "data": "inbound/ocr/English/english/c84bb283-928d-4312-878b-65484a45cd88.png",
    "type": "image",
    "language": "English"
}'::jsonb, null)
Union values('medium', 'ocr', '{
    "data": "inbound/ocr/English/english/e1fbad1b-6ca7-46f8-a0e7-c6d566a8e019.png",
    "type": "image",
    "language": "English"
}'::jsonb, null)
Union values('medium', 'ocr', '{
    "data": "inbound/ocr/English/english/b0e6322f-26a8-43dd-aa15-ba22f95edc3f.png",
    "type": "image",
    "language": "English"
}'::jsonb, null)
Union values('medium', 'ocr', '{
    "data": "inbound/ocr/English/english/c39856b8-a236-434c-885a-41daa8f43856.png",
    "type": "image",
    "language": "English"
}'::jsonb, null)
Union values('medium', 'ocr', '{
    "data": "inbound/ocr/English/english/c77b0af8-2139-4485-b650-566299d33c47.png",
    "type": "image",
    "language": "English"
}'::jsonb, null)
Union values('medium', 'ocr', '{
    "data": "inbound/ocr/English/english/cbb466a1-eec9-4099-89aa-3f2eedeb958d.png",
    "type": "image",
    "language": "English"
}'::jsonb, null)
Union values('medium', 'ocr', '{
    "data": "inbound/ocr/English/english/9979f721-b189-47de-aba4-bc8e81bd6e17.png",
    "type": "image",
    "language": "English"
}'::jsonb, null)
Union values('medium', 'ocr', '{
    "data": "inbound/ocr/English/english/354c1957-f398-41cc-b787-0bece6c17126.png",
    "type": "image",
    "language": "English"
}'::jsonb, null)
Union values('medium', 'ocr', '{
    "data": "inbound/ocr/English/english/281d6df3-a085-422a-8cae-a5e653a593c6.png",
    "type": "image",
    "language": "English"
}'::jsonb, null)
Union values('medium', 'ocr', '{
    "data": "inbound/ocr/English/english/ead846f9-2f36-417e-9b37-36ba83074026.png",
    "type": "image",
    "language": "English"
}'::jsonb, null)
Union values('medium', 'ocr', '{
    "data": "inbound/ocr/English/english/c001d07b-78c7-4967-b179-4f995082a785.png",
    "type": "image",
    "language": "English"
}'::jsonb, null)
Union values('medium', 'ocr', '{
    "data": "inbound/ocr/English/english/13726edf-48f8-4362-9414-27350589baf5.png",
    "type": "image",
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