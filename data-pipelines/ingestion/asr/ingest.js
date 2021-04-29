const fs = require('fs');

const { conn, insertMaster } = require('../common/dbUtils')

const ingest1 = async (datasetId, datasetType, client, datset_base_path, language, audio_paths) => {
    const values = audio_paths.map(path => {
        return `('medium', '${datasetType}',
            '{
            "data": "${datset_base_path}/${path}",
            "type": "audio",
            "language": "${language}"
            }', 
            ${datasetId}
        )`
    })

    const insert_rows = `insert into dataset_row 
    ( difficulty_level, type, media, master_dataset_id ) 
    values ${values} RETURNING dataset_row_id`

    const dataset_row_result = await client.query(`${insert_rows}`)
    const dataset_row_ids = dataset_row_result.rows.map(row => row.dataset_row_id)
    return dataset_row_ids
}


const ingest2 = async (datasetRowIds, client, datset_base_path, language, dataRows2) => {
    const result = await client.query(`select contributor_id from contributors where user_name='##system##'`)
    contributorId = result.rows[0].contributor_id

    const values = dataRows2.map((data, i) => {
        return `(${datasetRowIds[i]}, ${contributorId},
            '{
            "data": "${data}",
            "type": "text",
            "language": "${language}"
            }', 
            true,
            CURRENT_DATE,
            'completed'
        )`
    })

    const insert_rows = `insert into contributions 
    ( dataset_row_id, contributed_by, media, is_system , date, action) 
    values ${values} RETURNING contribution_id`

    const contributions_result = await client.query(`${insert_rows}`)
    const contributions_ids = contributions_result.rows.map(row => row.master_dataset_id);
    return contributions_ids
}

const parse1 = (files) => {
    const wav_paths = files.filter(x => x.split('.')[1] === 'wav')
    const audio_paths = wav_paths.map((x, i) => `${x.split('/').slice(-2)[0]}/${x.split('/').slice(-1)}`)
    return audio_paths
}

const parse2 = (files) => {
    const txt_files_content = files.filter(x => x.split('.')[1] === 'txt')
        .map(x => [fs.readFileSync(`${x}`, 'utf8').split('\n')[0]])
    return txt_files_content
}

const start = async (connectionString, params, remote_dataset_bundle_path, basePath, language, paired) => {
    const client = conn(connectionString)
    try {
        const files = fs.readFileSync('./asr_files.txt', 'utf8').split('\n');
        const id = await insertMaster(params, remote_dataset_bundle_path, client)

        console.log('Inserting in dataset_rows')

        audio_paths = parse1(files)
        const datasetRowIds = await ingest1(id, 'asr', client, `${basePath}/${language}`, language, audio_paths)
        console.log('Total dataset rows:', datasetRowIds.length)

        if (paired === 'paired') {
            console.log('Inserting in contributions')
            txts = parse2(files)
            const inserted = await ingest2(datasetRowIds, client, `${basePath}/${language}`, language, txts)
            console.log('Total txt rows:', inserted.length)
            console.log('Done..')
        }
    } catch (error) {
        console.log('error..', error)
    } finally {
        client.end()
    }
}

const main = () => {
    const params = process.argv[2]
    const remote_dataset_bundle_path = process.argv[3]

    const basePath = process.argv[4]
    const language = process.argv[5]

    const paired = process.argv[6]
    const connectionString = process.argv[7]

    console.log(basePath, language)
    start(connectionString, params, remote_dataset_bundle_path, basePath, language, paired)
}

main()