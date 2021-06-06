/* Replace with your SQL commands */
delete from language_goals where type in ('parallel', 'ocr', 'asr');

delete from language_goals where category='validate';
