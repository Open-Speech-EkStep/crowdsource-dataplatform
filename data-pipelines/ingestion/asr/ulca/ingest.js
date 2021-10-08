const fs = require('fs');

const { conn, insertMaster } = require('../../../common/dbUtils')

const MIN_DURATION = 1
const MAX_DURATION = 15

const ingest1 = async (datasetId, datasetType, client, datset_base_path, language, wav_paths, paired, wavToDataDict, profanity_check_required) => {
    const values = wav_paths
        .filter(path => {
            wavName = path.split('/').pop()
            element = wavToDataDict[wavName]
            return element.duration >= MIN_DURATION && element.duration <= MAX_DURATION
        })
        .map(path => {
            wavName = path.split('/').pop()
            element = wavToDataDict[wavName]
            const media = {
                "data": `${datset_base_path}/${path}`,
                "type": "audio",
                "language": `${language}`,
                "duration": element.duration,
                "snr": element.snr,
                "collectionSource": element.collectionSource,
                "gender": element.gender,
                "speaker": element.speaker
            }
            return `('medium', '${datasetType}',
                '${JSON.stringify(media)}', 
                ${datasetId},
                ${paired === 'paired' ? '\'contributed\'' : null},
                ${profanity_check_required ? null : false}
            )`
        })
    // console.log('ingest1', values)
    const insert_rows = `insert into dataset_row 
    ( difficulty_level, type, media, master_dataset_id, state, is_profane ) 
    values ${values} RETURNING dataset_row_id`

    console.log('insert query', insert_rows)
    const dataset_row_result = await client.query(`${insert_rows}`)
    const dataset_row_ids = dataset_row_result.rows.map(row => row.dataset_row_id)

    const dict = {}
    for (var i = 0; i < dataset_row_ids.length; i++) {
        wavName = wav_paths[i].split('/').pop()
        dict[wavName] = dataset_row_ids[i]
    }
    return dict
}


const ingest2 = async (imageToIdDict, client, datset_base_path, language, wavToDataDict) => {
    const result = await client.query(`select contributor_id from contributors where user_name='##system##'`)
    contributorId = result.rows[0].contributor_id
    values = []
    for (const [image, element] of Object.entries(wavToDataDict)) {
        const text = element.text
            .split("'").join("''")
            .split("‘").join("##")
            .split("##").join("''")
        const media = {
            "data": `${text}`,
            "type": "text",
            "language": `${language}`
        }
        values.push(`(${imageToIdDict[image]}, ${contributorId},
                '${JSON.stringify(media)}', 
                true,
                CURRENT_DATE,
                'completed'
            )`)

    }
    console.log('values', values)
    const insert_rows = `insert into contributions 
    ( dataset_row_id, contributed_by, media, is_system , date, action) 
    values ${values} RETURNING contribution_id`

    const contributions_result = await client.query(`${insert_rows}`)
    const contributions_ids = contributions_result.rows.map(row => row.master_dataset_id);
    return contributions_ids
}

const parse1 = (files) => {
    const wav_paths = files
        .map((x, i) => `${x.split('/').slice(-2)[0]}/${x.split('/').slice(-1)}`)
    return wav_paths
}

const parse = (data, files) => {
    allKeys = data
    const wavToTextDict = {}
    for (var i = 0; i < allKeys.length; i++) {
        element = allKeys[i]
        if (element.length == 1) {
            element = element[0]
        }
        wavToTextDict[element.audioFilename] = element
    }

    dict = {}
    for (var i = 0; i < files.length; i++) {
        wavFileName = files[i].split('/').pop()
        dict[wavFileName] = wavToTextDict[wavFileName]
    }
    return dict
}

const start = async (connectionString, localDatasetPath, params, remote_dataset_bundle_path, basePath, language, paired, profanity_check_required) => {
    const client = conn(connectionString)
    try {
        const files = fs.readFileSync('./asr_files.txt', 'utf8').split('\n')
            .filter(x => x.includes('.wav'));

        const id = await insertMaster(params, remote_dataset_bundle_path, client, 'asr')

        console.log('Inserting in dataset_rows')
        const data = JSON.parse(fs.readFileSync(`${localDatasetPath}/data.json`))
        wavToDataDict = parse(data, files)
        console.log(wavToDataDict)
        wav_paths = parse1(files)
        // console.log("wav_paths", wav_paths)

        console.log("inserting into dataset_row")

        const wavToIdDict = await ingest1(id, 'asr', client, `${basePath}/${language}`, language, wav_paths, paired, wavToDataDict, profanity_check_required)
        console.log(wavToIdDict)
        console.log('Total dataset rows:', wavToIdDict)

        if (paired === 'paired') {
            console.log('Inserting in contributions')
            const inserted = await ingest2(wavToIdDict, client, `${basePath}/${language}`, language, wavToDataDict)
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
    const localDatasetPath = process.argv[2]
    const remote_dataset_bundle_path = process.argv[3]

    const basePath = process.argv[4]
    const language = process.argv[5]

    const paired = process.argv[6]
    const connectionString = process.argv[7]

    console.log(localDatasetPath, remote_dataset_bundle_path, basePath, language, paired, connectionString)

    params = JSON.parse(fs.readFileSync(`${localDatasetPath}/params.json`, 'utf-8'))
    profanity_check_required = false
    start(connectionString, localDatasetPath, params, remote_dataset_bundle_path, basePath, language, paired, profanity_check_required)
}

main()
