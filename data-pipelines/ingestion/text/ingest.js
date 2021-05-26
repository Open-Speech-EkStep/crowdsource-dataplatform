const fs = require('fs');
const { conn, insertMaster } = require('../common/dbUtils')

const ingest1 = async (datasetId, datasetType, client, language, rows, paired) => {
    const values = rows
        .map(row => row.trim())
        .map(row => row.replace(/'/g, "''"))
        .map(row => {
            const media = {
                "data": `${row}`,
                "type": "text",
                "language": `${language}`
            }
            return `('medium', '${datasetType}',
                '${JSON.stringify(media)}', 
                ${datasetId},
                ${paired === 'paired' ? '\'contributed\'' : null},
                '${language}',
                '${row}'
            )`
        })
    console.log('values', values)
    const insert_rows = `insert into dataset_row 
    ( difficulty_level, type, media, master_dataset_id, state, language, sentence ) 
    values ${values} RETURNING dataset_row_id`

    const dataset_row_result = await client.query(`${insert_rows}`)
    const dataset_row_ids = dataset_row_result.rows.map(row => row.dataset_row_id)

    return dataset_row_ids
}


const start = async (connectionString, params, localDatasetPath, paired, remote_dataset_bundle_path, language) => {
    const client = conn(connectionString)
    try {
        const txtContent = fs.readFileSync(localDatasetPath, 'utf8').split('\n');
        console.log('Inserting in master')
        const id = await insertMaster(params, remote_dataset_bundle_path, client)
        const datasetRowIds = await ingest1(id, 'text', client, language, txtContent, paired)
        console.log('Done..', datasetRowIds.length)
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
    const language = process.argv[7]

    start(connectionString, params, localDatasetPath, paired, remote_dataset_bundle_path, language)
}

main()
