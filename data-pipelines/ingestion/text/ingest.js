const fs = require('fs');
const { conn, insertMaster, insertNewLanguageConfig } = require('../../common/dbUtils')

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
                false
            )`
        })
    console.log('values', values)
    const insert_rows = `insert into dataset_row 
    ( difficulty_level, type, media, master_dataset_id, state, is_profane ) 
    values ${values} RETURNING dataset_row_id`

    const dataset_row_result = await client.query(`${insert_rows}`)
    const dataset_row_ids = dataset_row_result.rows.map(row => row.dataset_row_id)

    return dataset_row_ids
}


const start = async (connectionString, params, localDatasetPath, paired, remote_dataset_bundle_path, language, user) => {
    const client = conn(connectionString)
    try {
        var txtContent = fs.readFileSync(localDatasetPath, 'utf8').split('\n');
        // txtContent = txtContent.slice(0, 10) // TODO remove hardcoding
        console.log('Inserting in master')
        const id = await insertMaster(params, remote_dataset_bundle_path, client, 'text', user)
        const datasetRowIds = await ingest1(id, 'text', client, language, txtContent, paired)
        console.log('Done..', datasetRowIds.length);

        await insertNewLanguageConfig(client, language);
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
    const user = process.argv[8]

    start(connectionString, params, localDatasetPath, paired, remote_dataset_bundle_path, language, user)
}

main()
