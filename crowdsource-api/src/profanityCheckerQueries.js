const getSentencesForProfanityCheck = `update dataset_row set profanity_checked_by = $1,profanity_checked_at = $2 ,assigned_for_profanity_check = true where \
dataset_row_id in (select dataset_row_id from dataset_row where assigned_for_profanity_check = false and type = $3 limit 20) returning *`

const updateSentenceWithProfanity = `update dataset_row set is_profane = $1 where dataset_row_id = $2 and profanity_checked_by = $3`

module.exports = 
{
    getSentencesForProfanityCheck,
    updateSentenceWithProfanity
}