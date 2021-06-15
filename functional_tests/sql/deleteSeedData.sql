update configurations set value=1 where config_name='include_profane';

update dataset_row set is_profane=null where type='text' and media->>'language'='Hindi';

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
