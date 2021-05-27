const { head } = require('fetch-mock');
const fs = require('fs');
const csv = require("csvtojson");

const { conn, insertMaster } = require('../common/dbUtils')

const ingest1 = async (datasetId, datasetType, client, language, rows, paired) => {
    const values = rows.map(row => {
        const media = {
            "data": `${row}`,
            "type": "text",
            "language": `${language}`
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
        const csvContent = await csv().fromFile(localDatasetPath);
        console.log('Inserting in master')
        const id = await insertMaster(params, remote_dataset_bundle_path, client)
        var count = 0
        const langTranslations = {}

        for (const rows of Object.values(csvContent)) {
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
            choosenRows = Object.values(Object.entries(rows).slice(rowStart - 1, rowEnd))
            choosenRows = choosenRows.map(r => r[1])
            console.log('choosenRows:', choosenRows)

            console.log('Inserting pair:', pair)
            const MAX_WORD_LENGTH = 15
            var skipped = 0
            for (const row of choosenRows) {
                const translations = Object.entries(row)
                translation1 = translations[0][0]
                translation2 = translations[0][1]
                console.log('translation1:', translation1)
                console.log('translation2:', translation2)

                if (translation1.split(' ').length <= MAX_WORD_LENGTH) {
                    count++
                    const datasetRowIds = await ingest1(id, 'parallel', client, language1, [translation1], paired)
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
