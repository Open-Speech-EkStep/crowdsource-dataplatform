--Clean all data
update configurations set value=0 where config_name='include_profane';

update dataset_row set is_profane=false where type='text' and media->>'language'='Hindi';

delete from validations where contribution_id in (
select contribution_id from contributions where dataset_row_id in (
select dataset_row_id from dataset_row where (type='asr' or type='ocr') and (media->> 'language'='Malayalam' or media->> 'language'='Telugu' or media->> 'language'='Odia' or media->> 'language'='Kannada' or media->> 'language'='Gujarati'))
);

delete from contributions where dataset_row_id in (
select dataset_row_id from dataset_row where (type='asr' or type='ocr') and (media->> 'language'='Malayalam' or media->> 'language'='Telugu' or media->> 'language'='Odia' or media->> 'language'='Kannada' or media->> 'language'='Gujarati')
);

delete from dataset_row where (type='asr' or type='ocr') and (media->> 'language'='Malayalam' or media->> 'language'='Telugu' or media->> 'language'='Odia' or media->> 'language'='Kannada' or media->> 'language'='Gujarati');

delete from validations where contribution_id in (
select contribution_id from contributions where dataset_row_id in (
select dataset_row_id from dataset_row where (type='parallel') and (media->> 'language'='Odia'))
);

delete from contributions where dataset_row_id in (
select dataset_row_id from dataset_row where (type='parallel') and (media->> 'language'='Odia')
);

delete from dataset_row where (type='parallel') and (media->> 'language'='Odia');

-- master dataset info

insert into master_dataset (params, location)
select '{"collectionSource": ["some source", "https://google.com/abcd/efg/hijk/lmnop"]}', 'testMDSLocation'
where not exists (
	select 1 from master_dataset where location='testMDSLocation'
);
insert into master_dataset (params, location)
select '{"collectionSource": null}', 'testMDSLocation2'
where not exists (
	select 1 from master_dataset where location='testMDSLocation2'
);

--ASR data

insert into dataset_row 
    ( difficulty_level, type, media, state, is_profane, master_dataset_id ) 
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Odia"
            }'::jsonb, null, false, (select master_dataset_id from master_dataset where location='testMDSLocation')
union all
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Odia"
            }'::jsonb, null, false, (select master_dataset_id from master_dataset where location='testMDSLocation')
union all
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Telugu",
            "collectionSource": null
            }'::jsonb, 'contributed', false, (select master_dataset_id from master_dataset where location='testMDSLocation2')
union all
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Telugu",
            "collectionSource": null
            }'::jsonb, 'contributed', false, (select master_dataset_id from master_dataset where location='testMDSLocation2')
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
            }'::jsonb, null, false, null
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
            }'::jsonb, null, false, null
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
            }'::jsonb, null, false, null
union all
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Kannada",
            "collectionSource": ["some source", "https://google.com/abcd/efg/hijk/lmnop"]
            }'::jsonb, 'contributed', false, null
union all
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Kannada",
            "collectionSource": ["some source", "https://google.com/abcd/efg/hijk/lmnop"]
            }'::jsonb, 'contributed', false, null
union all
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Kannada",
            "collectionSource": ["some source", "https://google.com/abcd/efg/hijk/lmnop"]
            }'::jsonb, 'contributed', false, null
union all
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Gujarati"
            }'::jsonb, null, true, null
            union all
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Gujarati"
            }'::jsonb, null, null, null
            union all
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Gujarati"
            }'::jsonb, 'contributed', true, null
            union all
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Gujarati"
            }'::jsonb, 'contributed', null, null;


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
            }'::jsonb, true, now(), 'completed' from dataset_row where type='asr' and media ->> 'language'='Kannada' and state='contributed'
            union all
select dataset_row_id, (select contributor_id from contributors where user_name='##system##'), '{
            "data": "ಹಲೋ ನೀವು ಇಂದು ಹೇಗೆ ಮಾಡುತ್ತಿದ್ದೀರಿ",
            "type": "text",
            "language": "Gujarati"
            }'::jsonb, true, now(), 'completed' from dataset_row where type='asr' and media ->> 'language'='Gujarati' and state='contributed';


--OCR data

insert into dataset_row 
    ( difficulty_level, type, media, state, is_profane ) 
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image1.png",
            "type": "image",
            "language": "Odia"
            }'::jsonb, null, false
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image2.png",
            "type": "image",
            "language": "Odia"
            }'::jsonb, null, false
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image1.png",
            "type": "image",
            "language": "Telugu"
            }'::jsonb, 'contributed', false
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image2.png",
            "type": "image",
            "language": "Telugu"
            }'::jsonb, 'contributed', false
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image1.png",
            "type": "image",
            "language": "Kannada"
            }'::jsonb, null, false
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image2.png",
            "type": "image",
            "language": "Kannada"
            }'::jsonb, null, false
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image1.png",
            "type": "image",
            "language": "Kannada"
            }'::jsonb, null, false
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image2.png",
            "type": "image",
            "language": "Kannada"
            }'::jsonb, null, false
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image1.png",
            "type": "image",
            "language": "Kannada"
            }'::jsonb, null, false
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image2.png",
            "type": "image",
            "language": "Kannada"
            }'::jsonb, null, false
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image2.png",
            "type": "image",
            "language": "Kannada"
            }'::jsonb, 'contributed', false
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image1.png",
            "type": "image",
            "language": "Kannada"
            }'::jsonb, 'contributed', false
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image2.png",
            "type": "image",
            "language": "Kannada"
            }'::jsonb, 'contributed', false
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image2.png",
            "type": "image",
            "language": "Gujarati"
            }'::jsonb, null, true
            union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image2.png",
            "type": "image",
            "language": "Gujarati"
            }'::jsonb, null, null
            union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image2.png",
            "type": "image",
            "language": "Gujarati"
            }'::jsonb, 'contributed', true
            union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image2.png",
            "type": "image",
            "language": "Gujarati"
            }'::jsonb, 'contributed', null;

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
            }'::jsonb, true, now(), 'completed' from dataset_row where type='ocr' and media ->> 'language'='Kannada' and state='contributed'
union all
select dataset_row_id, (select contributor_id from contributors where user_name='##system##'), '{
            "data": "ಹಲೋ ನೀವು ಇಂದು ಹೇಗೆ ಮಾಡುತ್ತಿದ್ದೀರಿ",
            "type": "text",
            "language": "Gujarati"
            }'::jsonb, true, now(), 'completed' from dataset_row where type='ocr' and media ->> 'language'='Gujarati' and state='contributed';


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
            }'::jsonb, null, false
union all
select 'medium', 'parallel', '{
            "data": "ଆପଣ କେଉଁଠାରେ ବାସ କରନ୍ତି",
            "type": "text",
            "language": "Odia"
            }'::jsonb, null, false
union all
select 'medium', 'parallel', '{
            "data": "ବର୍ତ୍ତମାନ ସମୟ କ’ଣ? ",
            "type": "text",
            "language": "Odia"
            }'::jsonb, null, false
union all
select 'medium', 'parallel', '{
            "data": "ମୁଁ ଆଜି ବହୁତ ଖୁସି ",
            "type": "text",
            "language": "Odia"
            }'::jsonb, null, false
union all
select 'medium', 'parallel', '{
            "data": "କେତେବେଳେ ବର୍ଷା ହେବ ",
            "type": "text",
            "language": "Odia"
            }'::jsonb, null, false ;


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


-- Profanity data for Suno India

Delete from dataset_row where media->> 'language' = 'Hindi' and type = 'asr';


insert into dataset_row ( difficulty_level, type, media, state ) 
values('medium', 'asr', '{
    "data": "inbound/asr/Hindi/swayamprabha_chapter_10/45_COMPUTER_:_EK_PARICHAY.wav",
    "type": "audio",
    "duration": 4.05,
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'asr', '{
    "data": "inbound/asr/Hindi/hindi_dataset_sunoindia/0_116_2758file-idiwD9nRhdnNQ.wav",
    "type": "audio",
    "duration": 5.64,
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'asr', '{
    "data": "inbound/asr/Hindi/hindi_dataset_sunoindia/0_133_1352file-idi8sk1zh-34c.wav",
    "type": "audio",
    "duration": 4.05,
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'asr', '{
    "data": "inbound/asr/Hindi/hindi_dataset_sunoindia/0_21_1292file-idiCT8Zjai2GI.wav",
    "type": "audio",
    "duration": 4.05,
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'asr', '{
    "data": "inbound/asr/Hindi/hindi_dataset_sunoindia/0_23_1384file-idt1rwaekFbc8.wav",
    "type": "audio",
    "duration": 4.05,
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'asr', '{
    "data": "inbound/asr/Hindi/hindi_dataset_sunoindia/0_28_DD_Science_Vigyan_Prasar_5.wav",
    "type": "audio",
    "duration": 4.05,
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'asr', '{
    "data": "inbound/asr/Hindi/hindi_dataset_sunoindia/0_48_1785file-idtfkKf_5PMCM.wav",
    "type": "audio",
    "duration": 4.05,
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'asr', '{
    "data": "inbound/asr/Hindi/hindi_dataset_sunoindia/0_41_1493file-id7LPboOKTWjY.wav",
    "type": "audio",
    "duration": 4.05,
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'asr', '{
    "data": "inbound/asr/Hindi/hindi_dataset_sunoindia/1.wav",
    "type": "audio",
    "duration": 4.05,
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'asr', '{
    "data": "inbound/asr/Hindi/hindi_dataset_sunoindia/102_2603file-idx_q3X038ZO4.wav",
    "type": "audio",
    "duration": 4.05,
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'asr', '{
    "data": "inbound/asr/Hindi/hindi_dataset_sunoindia/104_006-BRAHMAN_JEEVAN_KI_MARYADAYE-ONLY-BK.wav",
    "type": "audio",
    "duration": 4.05,
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'asr', '{
    "data": "inbound/asr/Hindi/hindi_dataset_sunoindia/104_2881file-idwzcBBj19ZQQ.wav",
    "type": "audio",
    "duration": 4.05,
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'asr', '{
    "data": "inbound/asr/Hindi/hindi_dataset_sunoindia/106_1292file-idiCT8Zjai2GI.wav",
    "type": "audio",
    "duration": 4.05,
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'asr', '{
    "data": "inbound/asr/Hindi/hindi_dataset_sunoindia/11_1578file-idXXxgbV5mOwo.wav",
    "type": "audio",
    "duration": 4.05,
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'asr', '{
    "data": "inbound/asr/Hindi/hindi_dataset_sunoindia/14.wav",
    "type": "audio",
    "duration": 4.05,
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'asr', '{
    "data": "inbound/asr/Hindi/hindi_dataset_sunoindia/1_5_1578file-idXXxgbV5mOwo.wav",
    "type": "audio",
    "duration": 4.05,
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'asr', '{
    "data": "inbound/asr/Hindi/hindi_dataset_sunoindia/2_11_1384file-idt1rwaekFbc8.wav",
    "type": "audio",
    "duration": 4.05,
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'asr', '{
    "data": "inbound/asr/Hindi/hindi_dataset_sunoindia/48_1415file-id4g86JC1LejU.wav",
    "type": "audio",
    "duration": 4.05,
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'asr', '{
    "data": "inbound/asr/Hindi/hindi_dataset_sunoindia/4_1578file-idXXxgbV5mOwo.wav",
    "type": "audio",
    "duration": 4.05,
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'asr', '{
    "data": "inbound/asr/Hindi/hindi_dataset_sunoindia/4_5_1578file-idXXxgbV5mOwo.wav",
    "type": "audio",
    "duration": 4.05,
    "language": "Hindi"
}'::jsonb, null);


-- Profanity data for Likho india

Delete from dataset_row where media->> 'language' = 'Hindi' and type = 'parallel';


insert into dataset_row ( difficulty_level, type, media, state ) 
values('medium', 'parallel', '{
    "data": "गरीबों की मदद के लिए अनेकों लोग साथ आ रहे हैं।",
    "type": "text",
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'parallel', '{
   "data": "इसी प्रेरणा से हर आक्रमण के बाद भारत और सशक्‍त होकर उभरा है।",
    "type": "text",
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'parallel', '{
   "data": "युवा भारत के लिए भी बहुत बड़ा दिन है",
    "type": "text",
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'parallel', '{
   "data": "तकनीक में बदलाव होने पर हमारी जीवन-शैली में भी बदलाव आया",
    "type": "text",
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'parallel', '{
   "data": "सामुदायिक सेवा, शिक्षा और महिला सशक्ति‍करण पर उनका विशेष बल सदैव याद किया जाएगा",
    "type": "text",
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'parallel', '{
   "data": "दक्षिण एशिया में दुनिया की एक-चौथाई जनसंख्‍या रहती है",
    "type": "text",
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'parallel', '{
   "data": "आज भारत में महिलाएं अंडरग्राउंड कोयले की खदान में काम कर रही हैं",
    "type": "text",
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'parallel', '{
   "data": "हम अपने कर्त्‍तव्य और जिम्मेदारी के प्रति सजग हैं",
    "type": "text",
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'parallel', '{
   "data": "आज देश आत्‍मविश्‍वास से भरा हुआ है",
    "type": "text",
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'parallel', '{
   "data": "ये भारत के ज्ञान को तो बढ़ाएंगी ही, भारत की एकता को भी बढ़ाएंगी",
    "type": "text",
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'parallel', '{
   "data": "उनके लिए राष्ट्रीय हित और जन कल्याण सर्वोपरि था।",
    "type": "text",
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'parallel', '{
   "data": "आप सब उस सपने को साकार करेंगे",
    "type": "text",
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'parallel', '{
   "data": "यह एक ऐसा भारत है जो नए आर्थिक अवसर प्रदान कर रहा है",
    "type": "text",
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'parallel', '{
   "data": "विशाल संख्‍या में पधारे हुए मेरे प्‍यारे भाईयो और बहनों",
    "type": "text",
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'parallel', '{
   "data": "भारत अवसरों की भूमि के तौर पर उभर रहा है",
    "type": "text",
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'parallel', '{
   "data": "मैं आज आप सब को नमन करने आया हूं",
    "type": "text",
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'parallel', '{
   "data": "उन्होंने टीवी सीरियलों और फिल्मों में उत्कृष्ट प्रदर्शन किया",
    "type": "text",
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'parallel', '{
   "data": "इस ताकत को बनाए रखने के लिए हर स्‍तर पर निरंतर काम जारी है",
    "type": "text",
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'parallel', '{
   "data": "इनमें से कुछ इस प्रकार हैं:",
    "type": "text",
    "language": "Hindi"
}'::jsonb, null)
Union values('medium', 'parallel', '{
   "data": "ये निर्णय नए भारत के आत्‍मविश्‍वास का प्रतीक है",
    "type": "text",
    "language": "Hindi"
}'::jsonb, null);

-- Boolo India INsertions

insert into dataset_row ( difficulty_level, type, media, state,is_profane ) 
values('medium', 'text', '{
    "data":" बल्कि मजबूरी थी 15 ", 
    "type": "text", 
    "language": "Hindi"
}'::jsonb, null , FALSE)
Union values('medium', 'text', '{
    "data": "बल्कि मजबूरी थी 16",
    "type": "text",
    "language": "Hindi"
}'::jsonb, null, FALSE)
Union values('medium', 'text', '{
    "data": "बल्कि मजबूरी थी 17",
    "type": "text",
    "language": "Hindi"
}'::jsonb, null, FALSE)
Union values('medium', 'text', '{
    "data": "बल्कि मजबूरी थी 18",
    "type": "text",
    "language": "Hindi"
}'::jsonb, null, FALSE)
Union values('medium', 'text', '{
    "data": "बल्कि मजबूरी थी 19",
    "type": "text",
    "language": "Hindi"
}'::jsonb, null, FALSE)
Union values('medium', 'text', '{
    "data": "बल्कि मजबूरी थी 20",
    "type": "text",
    "language": "Hindi"
}'::jsonb, null, FALSE)
Union values('medium', 'text', '{
    "data": "बल्कि मजबूरी थी 21",
    "type": "text",
    "language": "Hindi"
}'::jsonb, null, FALSE)
Union values('medium', 'text', '{
    "data": "बल्कि मजबूरी थी 22",
    "type": "text",
    "language": "Hindi"
}'::jsonb, null, FALSE)
Union values('medium', 'text', '{
    "data": "बल्कि मजबूरी थी 23",
    "type": "text",
    "language": "Hindi"
}'::jsonb, null, FALSE);


-- Badges Data

DELETE from rewards where contributor_id in(select contributor_id from contributors where user_name = 'Badge User');
DELETE from contributors where user_name = 'Badge User' ;

insert into contributors (user_name,contributor_identifier)
values ('Badge User','789456123abcde') ;


insert into rewards (contributor_id,milestone_id)
select (select contributor_id from contributors where user_name = 'Badge User'),milestone_id from reward_milestones where language in('Assamese') and type = 'ocr' and milestone in (5,50) and category = 'contribute'
union
select (select contributor_id from contributors where user_name = 'Badge User'),milestone_id from reward_milestones where language = 'Odia' and type = 'ocr' and milestone in (5,50,100) and category = 'validate'
union
select (select contributor_id from contributors where user_name = 'Badge User'),milestone_id from reward_milestones where language in('Bengali') and type = 'parallel' and milestone in (5,50,100,200) and category = 'validate' ;

REFRESH MATERIALIZED VIEW contributions_and_demo_stats;
REFRESH MATERIALIZED VIEW daily_stats_complete;
REFRESH MATERIALIZED VIEW gender_group_contributions;
REFRESH MATERIALIZED VIEW age_group_contributions;
REFRESH MATERIALIZED VIEW language_group_contributions;
REFRESH MATERIALIZED VIEW state_group_contributions;
REFRESH MATERIALIZED VIEW language_and_state_group_contributions;