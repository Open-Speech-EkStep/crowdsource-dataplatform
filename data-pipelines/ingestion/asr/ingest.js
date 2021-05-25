const fs = require('fs');
const { calculateDuration } = require('../common/audio_duration')
const { conn, insertMaster } = require('../common/dbUtils')

const MIN_DURATION = 1
const MAX_DURATION = 6
const ingest1 = async (datasetId, datasetType, client, datset_base_path, language, audio_paths_with_duration, paired) => {

    const values = audio_paths_with_duration
        .map(path_with_duration => {
            return `('medium', '${datasetType}',
            '{
            "data": "${datset_base_path}/${path_with_duration[0]}",
            "type": "audio",
            "language": "${language}",
            "duration": ${path_with_duration[1]}
            }', 
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
    const contributions_ids = contributions_result.rows.map(row => row.contribution_id);
    return contributions_ids
}

const parse1 = async (files, paired) => {
    const wav_paths_resolved = []
    for (var i = 0; i < files.length; i++) {
        path = files[i]
        const ext = path.split('.')[1]
        if (ext === 'wav') {
            try {
                const command = `sox --i -D ${path}`;
                const duration = await calculateDuration(command);
                const remote_path = `${path.split('/').slice(-2)[0]}/${path.split('/').slice(-1)}`

                if ((duration >= MIN_DURATION && duration <= MAX_DURATION)) {
                    if (paired === 'paired') {
                        const txtFilePath = `${path.split('.')[0]}.txt`
                        const txtContent = fs.readFileSync(`${txtFilePath}`, 'utf8').split('\n')[0]
                        const sanizedTxtContent = txtContent.replace("'", "''")
                        wav_paths_resolved.push([remote_path, duration, path, sanizedTxtContent])
                    } else {
                        wav_paths_resolved.push([remote_path, duration, path])
                    }
                }
            } catch (err) {
                console.log('Skipping for:', path, err)
            }
        }
    }
    console.log('wav_paths', wav_paths_resolved)
    return wav_paths_resolved
}

const parse2 = (wav_paths_resolved) => {
    console.log('wav_paths_resolved', wav_paths_resolved)
    const txt_files_content = wav_paths_resolved
        .map(x => x[3])
    console.log('txt_files_content', txt_files_content)
    return txt_files_content
}

const start = async (connectionString, params, remote_dataset_bundle_path, basePath, language, paired) => {
    const client = conn(connectionString)
    try {
        const files = fs.readFileSync('./asr_files.txt', 'utf8').split('\n');
        const id = await insertMaster(params, remote_dataset_bundle_path, client)

        console.log('Inserting in dataset_rows')

        audio_paths_duration = await parse1(files, paired)
        const datasetRowIds = await ingest1(id, 'asr', client, `${basePath}/${language}`, language, audio_paths_duration, paired)
        console.log('Total dataset rows:', datasetRowIds.length)

        if (paired === 'paired') {
            console.log('Inserting in contributions')
            txts = parse2(audio_paths_duration)
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
