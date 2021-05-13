const { head } = require('fetch-mock');
const fs = require('fs');
const csv = require("csvtojson");

const { conn, insertMaster } = require('../common/dbUtils')

const ingest1 = async (datasetId, datasetType, client, language, rows, paired) => {
    const values = rows.map(row => {
        const media = {
            "data": `"${row}"`,
            "type": "text",
            "language": `"${language}"`
        }
        return `('medium', '${datasetType}',
                '${JSON.stringify(media)}', 
                ${datasetId},
                ${paired === 'paired' ? '\'contributed\'' : null}
            )`
    })
    const insert_rows = `insert into dataset_row 
    ( difficulty_level, type, media, master_dataset_id, state ) 
    values ${values} RETURNING dataset_row_id`

    const dataset_row_result = await client.query(`${insert_rows}`)
    const dataset_row_ids = dataset_row_result.rows.map(row => row.dataset_row_id)

    return dataset_row_ids
}


const ingest2 = async (datasetIds, client, language, rows) => {
    const result = await client.query(`select contributor_id from contributors where user_name='##system##'`)
    contributorId = result.rows[0].contributor_id

    const values = rows.map((row, i) => {
        const media = {
            "data": `"${row}"`,
            "type": "text",
            "language": `"${language}"`
        }
        return `(${datasetIds[i]}, ${contributorId},
            '${JSON.stringify(media)}', 
            true,
            CURRENT_DATE,
            'completed'
            )`
    }
    )
    const insert_rows = `insert into contributions 
    ( dataset_row_id, contributed_by, media, is_system , date, action) 
    values ${values} RETURNING contribution_id`

    const contributions_result = await client.query(`${insert_rows}`)
    const contributions_ids = contributions_result.rows.map(row => row.master_dataset_id);
    return contributions_ids
}


const start = async (connectionString, params, localDatasetPath, paired, remote_dataset_bundle_path) => {
    const client = conn(connectionString)
    try {
        const csvContent = await csv().fromFile(localDatasetPath);
        console.log('Inserting in master')
        const id = await insertMaster(params, remote_dataset_bundle_path, client)
        var count = 0
        for (const translations of Object.values(csvContent)) {
            for (const [language1, translation1] of Object.entries(translations)) {
                for (const [language2, translation2] of Object.entries(translations)) {
                    if (language1 != language2) {
                        console.log(language1, '-', language2)
                        console.log('Inserting in dataset_rows')
                        count++
                        const datasetRowIds = await ingest1(id, 'parallel', client, language1, [translation1], paired)
                        if (paired === 'paired') {
                            console.log('Inserting in contributions')
                            const inserted = await ingest2(datasetRowIds, client, language2, [translation2])
                            console.log('Total txt rows:', inserted.length)
                        }
                    }
                }
            }
        }

        console.log('Done..', count)


    } catch (error) {
        console.log('error..', error)
    } finally {
        client.end()
    }
}

const main = () => {
    const localDatasetPath = process.argv[2]
    const paired = process.argv[3]
    const connectionString = process.argv[4]
    const remote_dataset_bundle_path = process.argv[5]
    const params = process.argv[6]

    start(connectionString, params, localDatasetPath, paired, remote_dataset_bundle_path)
}

main()