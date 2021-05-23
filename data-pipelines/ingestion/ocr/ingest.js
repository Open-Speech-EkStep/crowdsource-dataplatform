const fs = require('fs');

const { conn, insertMaster } = require('../common/dbUtils')

const ingest1 = async (datasetId, datasetType, client, datset_base_path, language, png_paths, paired) => {
    const values = png_paths.map(path => {
        const media = {
            "data": `${datset_base_path}/${path}`,
            "type": "image",
            "language": `${language}`
        }
        return `('medium', '${datasetType}',
                '${JSON.stringify(media)}', 
                ${datasetId},
                ${paired === 'paired' ? '\'contributed\'' : null}
            )`
    })
    // console.log('ingest1', values)
    const insert_rows = `insert into dataset_row 
    ( difficulty_level, type, media, master_dataset_id, state ) 
    values ${values} RETURNING dataset_row_id`

    const dataset_row_result = await client.query(`${insert_rows}`)
    const dataset_row_ids = dataset_row_result.rows.map(row => row.dataset_row_id)

    const dict = {}
    for (var i = 0; i < dataset_row_ids.length; i++) {
        pngName = png_paths[i].split('/').pop()
        dict[pngName] = dataset_row_ids[i]
    }
    return dict
}


const ingest2 = async (imageToIdDict, client, datset_base_path, language, imageToTextDict) => {
    const result = await client.query(`select contributor_id from contributors where user_name='##system##'`)
    contributorId = result.rows[0].contributor_id
    values = []
    for (const [image, text] of Object.entries(imageToTextDict)) {
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

    const insert_rows = `insert into contributions 
    ( dataset_row_id, contributed_by, media, is_system , date, action) 
    values ${values} RETURNING contribution_id`

    const contributions_result = await client.query(`${insert_rows}`)
    const contributions_ids = contributions_result.rows.map(row => row.master_dataset_id);
    return contributions_ids
}

const parse1 = (files) => {
    const png_paths = files.map((x, i) => `${x.split('/').slice(-2)[0]}/${x.split('/').slice(-1)}`)
    return png_paths
}

const parse2 = (localDatasetPath, files) => {
    const data = JSON.parse(fs.readFileSync(`${localDatasetPath}/data.json`, 'utf-8'))
    allKeys = data
    const imageToTextDict = {}
    for (var i = 0; i < allKeys.length; i++) {
        element = allKeys[i][0]
        imageToTextDict[element.imageFilename] = element.groundTruth
    }

    dict = {}
    for (var i = 0; i < files.length; i++) {
        pngName = files[i].split('/').pop()
        dict[pngName] = imageToTextDict[pngName]
    }
    return dict
}

const start = async (connectionString, localDatasetPath, params, remote_dataset_bundle_path, basePath, language, paired) => {
    const client = conn(connectionString)
    try {
        const files = fs.readFileSync('./ocr_files.txt', 'utf8').split('\n')
            .filter(x => x.split('.')[1] === 'png');

        const id = await insertMaster(params, remote_dataset_bundle_path, client)

        console.log('Inserting in dataset_rows')

        png_paths = parse1(files)
        const imageToIdDict = await ingest1(id, 'ocr', client, `${basePath}/${language}`, language, png_paths, paired)
        // console.log('Total dataset rows:', imageToIdDict.size())

        if (paired === 'paired') {
            console.log('Inserting in contributions')
            imageToTextDict = parse2(localDatasetPath, files)
            const inserted = await ingest2(imageToIdDict, client, `${basePath}/${language}`, language, imageToTextDict)
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

    console.log(basePath, language)

    params = JSON.parse(fs.readFileSync(`${localDatasetPath}/params.json`, 'utf-8'))
    start(connectionString, localDatasetPath, {}, remote_dataset_bundle_path, basePath, language, paired)
}

main()
