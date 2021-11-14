import db from './dbConnection'
import {dbResult} from '../types/dbResponseType'

const getContributionInfo = async (contributionId: number) : Promise<dbResult | null> => {
    return db.oneOrNone(`select c.media->>'data' as userInput, d.type, con.media->>'data' as modelOutput, d.media ->>'language' as language
                    from contributions c
                    inner join dataset_row d on d.dataset_row_id=c.dataset_row_id
                    inner join contributions con on d.dataset_row_id=con.dataset_row_id and con.is_system=true
                    where c.contribution_id=$1;`, [contributionId]);
}

const allowDisallowValidationOnContribution = async (contributionId: number, allowValidation: boolean) : Promise<void> => {
    db.none(`update contributions set allow_validation = $2 where contribution_id=$1;`, [contributionId, allowValidation])
}

export default { getContributionInfo, allowDisallowValidationOnContribution }