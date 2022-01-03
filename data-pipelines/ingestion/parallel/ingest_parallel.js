const fs = require('fs');
const csv = require("csvtojson");
const xlsx = require("xlsx");

const { conn, insertMaster } = require('../../common/dbUtils');

const MAX_WORD_LENGTH = 20

const ingest1 = async (datasetId, datasetType, client, language, rows, paired, profanity_check_required, existingData) => {
    const textToId = {}
    const values = []
    const translation1 = []
    console.log('profanity_check_required', profanity_check_required)
    for (row of rows) {
        if (existingData[row] == null) {
            const media = {
                "data": `${row}`,
                "type": "text",
                "language": `${language}`
            }
            values.push(`('medium', '${datasetType}',
                '${JSON.stringify(media)}', 
                ${datasetId},
                ${paired === 'paired' ? '\' \'' : null},
                ${profanity_check_required === 'false' ? false : null}
            )`)
            translation1.push(row)
        } else {
            textToId[row] = existingData[row]
        }
    }

    const insert_rows = `insert into dataset_row 
    ( difficulty_level, type, media, master_dataset_id, state , is_profane) 
    values ${values} RETURNING dataset_row_id`

    const dataset_row_result = await client.query(`${insert_rows}`)

    for (var i = 0; i < dataset_row_result.rows.length; i++) {
        const text = translation1[i]
        textToId[text] = dataset_row_result.rows[i].dataset_row_id
    }

    return textToId
}


const ingest2 = async (textToId, client, language, translation1, translation2) => {
    const result = await client.query(`select contributor_id from contributors where user_name='##system##'`)
    contributorId = result.rows[0].contributor_id

    const values = []

    for (var i = 0; i < translation2.length; i++) {
        const media = {
            "data": `${translation2[i]}`,
            "type": "text",
            "language": `${language}`
        }
        values.push(`(${textToId[translation1[i]]}, ${contributorId},
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
    const contributions_ids = contributions_result.rows.map(row => row.contribution_id);
    return contributions_ids
}


const start = async (connectionString, params, localDatasetPath, paired,
    remote_dataset_bundle_path, pairs, profanity_check_required, format) => {
    const client = conn(connectionString)
    try {
        var workbook = xlsx.readFile(localDatasetPath);
        var sheet_name_list = workbook.SheetNames;
        var csvContent = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        console.log('Inserting in master')
        const id = await insertMaster(params, remote_dataset_bundle_path, client)
        pairs_parsed = pairs.split(':')
        language1 = pairs_parsed[0]
        language2 = pairs_parsed[1]

        const translation1 = []
        const translation2 = []

        for (row of csvContent) {
            if (row[language1].split(" ").length <= MAX_WORD_LENGTH
                && row[language2].split(" ").length <= MAX_WORD_LENGTH) {
                translation1.push(sanitize(row[language1]))
                translation2.push(sanitize(row[language2]))
            }
        }

        existingData = await getExistingData(language1, "parallel", client)

        console.log('Inserting in dataset_row:')

        textToId = await ingest1(id, 'parallel', client, language1, translation1, paired, profanity_check_required, existingData)
        if (paired === 'paired') {
            console.log('Inserting in contributions:')
            const inserted = await ingest2(textToId, client, language2, translation1, translation2)
            console.log('Total txt rows:', inserted.length)
        }
    } catch (error) {
        console.log('error..', error)
    } finally {
        client.end()
    }
}

const getExistingData = async (language, type, client) => {
    const select_rows = `select media->>'data' as data, dataset_row_id as id from dataset_row where type = '${type}' and media->>'language' = '${language}' and is_active=true`
    const dataset_row_result = await client.query(`${select_rows}`)
    textToId = {}
    for (row of dataset_row_result.rows) {
        textToId[row.data] = row.id
    }
    return textToId
}

const sanitize = (str) => {
    return str.split("'").join("''")
}

const main = () => {
    const localDatasetPath = process.argv[2]
    const paired = process.argv[3]
    const connectionString = process.argv[4]
    const remote_dataset_bundle_path = process.argv[5]
    const params = process.argv[6]
    const pairs = process.argv[7]
    const profanity_check_required = process.argv[8]
    const format = process.argv[9]


    console.log('pairs:', pairs)
    start(connectionString, params, localDatasetPath, paired, remote_dataset_bundle_path, pairs, profanity_check_required, format)
}

main()
