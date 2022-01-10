----Clean all data
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
insert into master_dataset (params, location, is_active)
select '{"collectionSource": null}', 'testMDSLocation3', false
where not exists (
	select 1 from master_dataset where location='testMDSLocation3'
);

--Dummy data for stats and charts

delete from validations where contribution_id in
(
    select c.contribution_id from contributions c
    inner join dataset_row d on c.dataset_row_id=d.dataset_row_id
    where d.media->>'language'='testLang'
);

delete from contributions where contribution_id in
(
    select c.contribution_id from contributions c
    inner join dataset_row d on c.dataset_row_id=d.dataset_row_id
    where d.media->>'language'='testLang'
);

delete from dataset_row where media->>'language'='testLang';

insert into dataset_row 
    ( difficulty_level, type, media, state, is_profane, master_dataset_id ) 
select 'medium', 'asr', '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "testLang"
            }'::jsonb, 'contributed', false, (select master_dataset_id from master_dataset where location='testMDSLocation');
insert into contributions 
    ( dataset_row_id, contributed_by, media, is_system , date, action) 
select dataset_row_id, (select contributor_id from contributors where user_name='##system##'), '{
            "data": "హలో మీరు ఈ రోజు ఎలా ఉన్నారు",
            "type": "text",
            "language": "testLang"
            }'::jsonb, false, now(), 'completed' from dataset_row where type='asr' and media ->> 'language'='testLang';

insert into dataset_row 
    ( difficulty_level, type, media, state, is_profane ) 
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image1.png",
            "type": "image",
            "language": "testLang"
            }'::jsonb, 'contributed', false;
insert into contributions 
    ( dataset_row_id, contributed_by, media, is_system , date, action) 
select dataset_row_id, (select contributor_id from contributors where user_name='##system##'), '{
            "data": "హలో మీరు ఈ రోజు ఎలా ఉన్నారు",
            "type": "text",
            "language": "testLang"
            }'::jsonb, false, now(), 'completed' from dataset_row where type='ocr' and media ->> 'language'='testLang';

insert into dataset_row 
    ( difficulty_level, type, media, state,is_profane ) 
select 'medium', 'parallel', '{
            "data": "କେମିତି ଅଛନ୍ତି, କେମିତି ଅଛ",
            "type": "text",
            "language": "testLang"
            }'::jsonb, 'contributed', false;
insert into contributions 
    ( dataset_row_id, contributed_by, media, is_system , date, action) 
select dataset_row_id, (select contributor_id from contributors where user_name='##system##'), '{
            "data": "హలో మీరు ఈ రోజు ఎలా ఉన్నారు",
            "type": "text",
            "language": "testLang2"
            }'::jsonb, false, now(), 'completed' from dataset_row where type='parallel' and media ->> 'language'='testLang';

insert into dataset_row ( difficulty_level, type, media, state,is_profane ) 
values('medium', 'text', '{
    "data":" बल्कि मजबूरी थी 15 ", 
    "type": "text", 
    "language": "testLang"
}'::jsonb, 'contributed' , FALSE);
insert into contributions 
    ( dataset_row_id, contributed_by, media, is_system , date, action) 
select dataset_row_id, (select contributor_id from contributors where user_name='##system##'), '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "testLang2"
            }'::jsonb, false, now(), 'completed' from dataset_row where type='text' and media ->> 'language'='testLang';


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
            }'::jsonb, null, false, CAST(NULL AS INTEGER)
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image1.png",
            "type": "image",
            "language": "Telugu"
            }'::jsonb, 'contributed', false, CAST(NULL AS INTEGER)
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image2.png",
            "type": "image",
            "language": "Telugu"
            }'::jsonb, 'contributed', false, CAST(NULL AS INTEGER)
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image1.png",
            "type": "image",
            "language": "Kannada"
            }'::jsonb, null, false, CAST(NULL AS INTEGER)
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image2.png",
            "type": "image",
            "language": "Kannada"
            }'::jsonb, null, false, CAST(NULL AS INTEGER)
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image1.png",
            "type": "image",
            "language": "Kannada"
            }'::jsonb, null, false, CAST(NULL AS INTEGER)
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image2.png",
            "type": "image",
            "language": "Kannada"
            }'::jsonb, null, false, CAST(NULL AS INTEGER)
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image1.png",
            "type": "image",
            "language": "Kannada"
            }'::jsonb, null, false, CAST(NULL AS INTEGER)
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image2.png",
            "type": "image",
            "language": "Kannada"
            }'::jsonb, null, false, CAST(NULL AS INTEGER)
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image2.png",
            "type": "image",
            "language": "Kannada"
            }'::jsonb, 'contributed', false, CAST(NULL AS INTEGER)
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image2.png",
            "type": "image",
            "language": "Kannada"
            }'::jsonb, 'contributed', false, CAST(NULL AS INTEGER)
union all         
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image1.png",
            "type": "image",
            "language": "Kannada"
            }'::jsonb, 'contributed', false, CAST(NULL AS INTEGER)
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image2.png",
            "type": "image",
            "language": "Kannada"
            }'::jsonb, 'contributed', false, CAST(NULL AS INTEGER)
union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image2.png",
            "type": "image",
            "language": "Gujarati"
            }'::jsonb, null, true, CAST(NULL AS INTEGER)
            union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image2.png",
            "type": "image",
            "language": "Gujarati"
            }'::jsonb, null, null, CAST(NULL AS INTEGER)
            union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image2.png",
            "type": "image",
            "language": "Gujarati"
            }'::jsonb, 'contributed', true, CAST(NULL AS INTEGER)
            union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image2.png",
            "type": "image",
            "language": "Gujarati"
            }'::jsonb, 'contributed', true, (select master_dataset_id from master_dataset where location='testMDSLocation')::integer
            union all
select 'medium', 'ocr', '{
            "data": "automationTestData/ocr/image2.png",
            "type": "image",
            "language": "Gujarati"
            }'::jsonb, 'contributed', null, CAST(NULL AS INTEGER);

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


-- Text Data Insertions

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

insert into dataset_row 
    ( difficulty_level, type, media, state, is_profane, master_dataset_id ) 
values('medium', 'text', '{
    "data": "ଏକଥା ସାରା ଗାଁ ଜାଣେ କମଳା 1",
    "type": "text",
    "language": "Odia"
}'::jsonb, 'contributed', false, (select master_dataset_id from master_dataset where location='testMDSLocation5'))
Union values('medium', 'text', '{
    "data": "ଏକଥା ସାରା ଗାଁ ଜାଣେ କମଳା 2",
    "type": "text",
    "language": "Odia"
}'::jsonb, 'contributed', false, (select master_dataset_id from master_dataset where location='testMDSLocation5'))
Union values('medium', 'text', '{
    "data": "ଏକଥା ସାରା ଗାଁ ଜାଣେ କମଳା 3",
    "type": "text",
    "language": "Odia"
}'::jsonb, 'contributed', false, (select master_dataset_id from master_dataset where location='testMDSLocation5'))
Union values('medium', 'text', '{
    "data": "ଏକଥା ସାରା ଗାଁ ଜାଣେ କମଳା 4",
    "type": "text",
    "language": "Odia"
}'::jsonb, 'contributed', false, (select master_dataset_id from master_dataset where location='testMDSLocation5'))
Union values('medium', 'text', '{
    "data": "ଏକଥା ସାରା ଗାଁ ଜାଣେ କମଳା 5",
    "type": "text",
    "language": "Odia"
}'::jsonb, 'contributed', false, (select master_dataset_id from master_dataset where location='testMDSLocation5'))
Union values('medium', 'text', '{
    "data": "ଏକଥା ସାରା ଗାଁ ଜାଣେ କମଳା 6",
    "type": "text",
    "language": "Odia"
}'::jsonb, null, false, (select master_dataset_id from master_dataset where location='testMDSLocation5'))
Union values('medium', 'text', '{
    "data": "ଏକଥା ସାରା ଗାଁ ଜାଣେ କମଳା 7",
    "type": "text",
    "language": "Odia"
}'::jsonb, null, false, (select master_dataset_id from master_dataset where location='testMDSLocation5'))
Union values('medium', 'text', '{
    "data": "ଏକଥା ସାରା ଗାଁ ଜାଣେ କମଳା 8",
    "type": "text",
    "language": "Odia"
}'::jsonb, null, false, (select master_dataset_id from master_dataset where location='testMDSLocation5'))
Union values('medium', 'text', '{
    "data": "ଏକଥା ସାରା ଗାଁ ଜାଣେ କମଳା 9",
    "type": "text",
    "language": "Odia"
}'::jsonb, null, false, (select master_dataset_id from master_dataset where location='testMDSLocation5'))
Union values('medium', 'text', '{
    "data": "ଏକଥା ସାରା ଗାଁ ଜାଣେ କମଳା 10",
    "type": "text",
    "language": "Odia"
}'::jsonb, null, false, (select master_dataset_id from master_dataset where location='testMDSLocation5'));

insert into contributions 
    ( dataset_row_id, contributed_by, media, is_system , date, action)
	select dataset_row_id, (select contributor_id from contributors where user_name='##system##'), '{
            "data": "automationTestData/asr/0_7_1481file-idQNBJvgvyfuU.wav",
            "type": "audio",
            "language": "Odia"
            }'::jsonb, true, now(), 'completed' from dataset_row where type='text' and media ->> 'language'='Odia' and state='contributed';

-- Badges Data

DELETE from rewards where contributor_id in (select contributor_id from contributors where user_name = 'Badge User' and contributor_identifier='789456123abcde');
DELETE from contributors where user_name = 'Badge User' and contributor_identifier='789456123abcde';

insert into contributors (user_name,contributor_identifier)
values ('Badge User','789456123abcde') ;


insert into rewards (contributor_id,milestone_id)
select (select contributor_id from contributors where user_name = 'Badge User' and contributor_identifier='789456123abcde'),milestone_id from reward_milestones where language in('Assamese') and type = 'ocr' and milestone in (5,50) and category = 'contribute'
union
select (select contributor_id from contributors where user_name = 'Badge User' and contributor_identifier='789456123abcde'),milestone_id from reward_milestones where language = 'Odia' and type = 'ocr' and milestone in (5,50,200) and category = 'validate'
union
select (select contributor_id from contributors where user_name = 'Badge User' and contributor_identifier='789456123abcde'),milestone_id from reward_milestones where language in('Bengali') and type = 'parallel' and milestone in (5,50,200,600) and category = 'validate' ;

REFRESH MATERIALIZED VIEW contributions_and_demo_stats;
REFRESH MATERIALIZED VIEW daily_stats_complete;
REFRESH MATERIALIZED VIEW gender_group_contributions;
REFRESH MATERIALIZED VIEW gender_and_language_group_contributions;
REFRESH MATERIALIZED VIEW age_group_contributions;
REFRESH MATERIALIZED VIEW age_group_and_language_contributions;
REFRESH MATERIALIZED VIEW language_group_contributions;
REFRESH MATERIALIZED VIEW state_group_contributions;
REFRESH MATERIALIZED VIEW language_and_state_group_contributions;
