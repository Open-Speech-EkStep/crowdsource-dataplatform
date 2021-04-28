const { Client } = require('pg');

const conn = (connectionString) => {
    const client = new Client({
        connectionString: connectionString
    });
    client.connect().then(ok => { console.log("ok connection done") });
    return client
}

const insertMaster = async (params, location, client) => {
    const insert_master = `insert into master_dataset (params,location) values ('${params}','${location}') RETURNING master_dataset_id`

    const result = await client.query(`${insert_master}`)
    const datasetId = result.rows[0].master_dataset_id;
    console.log('master_dataset_id=', datasetId)
    return datasetId
}
module.exports = { conn, insertMaster }