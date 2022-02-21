const { Client } = require('pg');

const conn = (connectionString) => {
    const client = new Client({
        connectionString: connectionString
    });
    client.connect().then(ok => { console.log("ok connection done") });
    return client
}

const insertMaster = async (params, location, client, type, user) => {
    console.log('params', params)
    const paramsStr = JSON.stringify(params)
        .split("'").join("''")

    const ingested_by = user || "system_user";
    const insert_master = `insert into master_dataset (params,location, dataset_type, ingested_by) values ('${paramsStr}','${location}', '${type}', '${ingested_by}') RETURNING master_dataset_id`

    const result = await client.query(`${insert_master}`)
    const datasetId = result.rows[0].master_dataset_id;
    console.log('master_dataset_id=', datasetId)
    return datasetId
}

const insertNewLanguageConfig = async (client, language) => {
    const insert_language_reward_milestones = `insert into reward_milestones (milestone, language, reward_catalogue_id, type, category)
    select milestone, '${language}', reward_catalogue_id, type, category from reward_milestones where language='English'
    and
    not exists (select 1 from reward_milestones where language='${language}')`;

    const insert_language_goal = `insert into language_goals (goal, language, type, category)
    select goal, '${language}', type, category from language_goals where language='English' 
    and not exists (select 1 from language_goals where language='${language}')`;

    await client.query(`${insert_language_reward_milestones}`)
    await client.query(`${insert_language_goal}`)
}

module.exports = { conn, insertMaster, insertNewLanguageConfig }
