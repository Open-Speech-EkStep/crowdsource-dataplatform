const fs = require('fs');
const csv = require("csvtojson");

const { conn, insertMaster } = require('../common/dbUtils')

const ingest1 = async (datasetId, datasetType, client, language, rows, paired, profanity_check_required) => {
    const values = rows.map(row => {
        const media = {
            "data": `${row}`,
            "type": "text",
            "language": `${language}`
        }
        return `('medium', '${datasetType}',
                '${JSON.stringify(media)}', 
                ${datasetId},
                ${paired === 'paired' ? '\'contributed\'' : null},
                ${profanity_check_required === 'false' ? false : null}
            )`
    })
    const insert_rows = `insert into dataset_row 
    ( difficulty_level, type, media, master_dataset_id, state , is_profane) 
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
            "data": `${row}`,
            "type": "text",
            "language": `${language}`
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


const start = async (connectionString, params, localDatasetPath, paired, remote_dataset_bundle_path, pairs) => {
    const client = conn(connectionString)
    try {
        const csvContent = await csv({ delimiter: '#' }).fromFile(localDatasetPath)
        console.log('Inserting in master')
        const id = await insertMaster(params, remote_dataset_bundle_path, client)
        var count = 0
        const langTranslations = {}
        const nvalues = Object.values(csvContent)
        console.log('nvalues', nvalues)
        for (const rows of nvalues) {
            for (const [language1, translation1] of Object.entries(rows)) {
                for (const [language2, translation2] of Object.entries(rows)) {
                    translationRows = langTranslations[`${language1}-${language2}`]
                    if (translationRows == null) {
                        translationRows = []
                        langTranslations[`${language1}-${language2}`] = translationRows
                    }
                    translation = {}
                    translation[translation1] = translation2
                    translationRows.push(translation)

                }
            }
        }
        console.log("langTranslations", langTranslations)
        const textToId = {}
        for (const [pair, rownum] of Object.entries(JSON.parse(pairs))) {
            languages = pair.split('-')
            language1 = languages[0]
            language2 = languages[1]
            console.log('pairs:', language1, language2)
            rowRange = rownum.split('-')
            rowStart = parseInt(rowRange[0])
            rowEnd = parseInt(rowRange[1])
            console.log(pair, rownum)
            console.log(rowStart, rowEnd)
            rows = langTranslations[pair]
            if (rows == null) {
                console.log('rows null for pair:', pair)
                continue
            }
            choosenRows = Object.values(Object.entries(rows).slice(rowStart - 1, rowEnd))
            choosenRows = choosenRows.map(r => r[1])
            console.log('choosenRows:', choosenRows)

            console.log('Inserting pair:', pair)
            const MAX_WORD_LENGTH = 20
            var skipped = 0
            for (const row of choosenRows) {
                const translations = Object.entries(row)

                translation1 = translations[0][0]
                    .split("'").join("''")
                translation2 = translations[0][1]
                    .split("'").join("''")

                console.log('translation1:', translation1)
                console.log('translation2:', translation2)

                if (translation1.split(' ').length <= MAX_WORD_LENGTH) {
                    count++
                    var datasetRowIds = []
                    if (textToId[translation1] == null) {
                        datasetRowIds = await ingest1(id, 'parallel', client, language1, [translation1], paired, profanity_check_required)
                        textToId[translation1] = datasetRowIds
                    } else {
                        datasetRowIds = textToId[translation1]
                    }
                    if (paired === 'paired') {
                        console.log('Inserting in contributions:', translation2)
                        const inserted = await ingest2(datasetRowIds, client, language2, [translation2])
                        console.log('Total txt rows:', inserted.length)
                    }
                } else {
                    console.log('length above threshold', translation1, translation2)
                    skipped++
                }
            }
            console.log('Done..', count)
            console.log('Skipped..', skipped)

        }
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
    const pairs = process.argv[7]
    console.log('pairs:', JSON.parse(pairs))
    start(connectionString, params, localDatasetPath, paired, remote_dataset_bundle_path, pairs)
}

main()
