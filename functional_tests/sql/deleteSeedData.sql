
delete from validations where contribution_id in (
select contribution_id from contributions where dataset_row_id in (
select dataset_row_id from dataset_row where (type='asr' or type='ocr') and (media->> 'language'='Malayalam' or media->> 'language'='Telugu' or media->> 'language'='Odia' or media->> 'language'='Kannada'))
);

delete from contributions where dataset_row_id in (
select dataset_row_id from dataset_row where (type='asr' or type='ocr') and (media->> 'language'='Malayalam' or media->> 'language'='Telugu' or media->> 'language'='Odia' or media->> 'language'='Kannada')
);

delete from dataset_row where (type='asr' or type='ocr') and (media->> 'language'='Malayalam' or media->> 'language'='Telugu' or media->> 'language'='Odia' or media->> 'language'='Kannada');
