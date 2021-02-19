INSERT INTO contributions (
	 sentence_id, audio_path, contributed_by, date, action)
	
	
select s."sentenceId", s."fileName" ,con."contributor_id",s."assignDate", 'completed' from "sentences" s
inner join "contributors" con on con."contributor_identifier" = s."userId" where s."fileName" is NOT NULL;
;