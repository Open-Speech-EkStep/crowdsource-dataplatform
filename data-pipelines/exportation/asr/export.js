const fs = require('fs');

const { conn } = require('../../common/dbUtils');


// Punjabi, Odia, Sanskrit


const getDataFromDB = async (connectionString, language) => {
    const client = conn(connectionString);
    try {
        const query = `select dr.dataset_row_id, dr.type, dr.master_dataset_id, dr.media->>'data' as audio_file_path, dr.media->>'collectionSource' as collection_source,
        dr.media->>'snr' as snr, dr.media->>'duration' as duration, dr.media->>'gender' as gender,
        con.contribution_id, con.date, con.media->>'data' as contribution_data, con.media->>'language' as contribution_language 
        from master_dataset md
        inner join dataset_row dr on md.master_dataset_id=dr.master_dataset_id
        inner join (select cona.* from contributions cona 
        left outer join contributions conb on
        cona.dataset_row_id=conb.dataset_row_id and cona.contribution_id<conb.contribution_id
        where cona.action='completed' and conb.dataset_row_id is null) con
        on dr.type='asr' and dr.media->>'language'='${language}' and dr.dataset_row_id=con.dataset_row_id and con.action='completed'`;

        const result = await client.query(query);
        const filePathList = result.rows.map(row => row.audio_file_path);

        console.log(filePathList);

        const data = result.rows.map(row => {
            return {
                audioFilename: (row.audio_file_path || "").split('/').slice(-1)[0],
                collectionSource: JSON.parse(row.collection_source),
                snr: JSON.parse(row.snr),
                duration: row.duration,
                gender: row.gender,
                text: row.contribution_data
            }
        })

        return { filePathList, data };
    } catch (error) {
        console.log(error);
    } finally {
        client.end();
    }
}

const writeAudioPaths = (paths) => {
    const audiopath = __dirname + '/audio_paths.txt';
    const file = fs.createWriteStream(audiopath);
    file.on('error', (err) => console.log(err));
    paths.forEach(function (path) { file.write(path + '\n'); });
    file.end();
}

const writeDataJson = (data, exportDir) => {
    const filename = 'data.json';
    fs.writeFile(`${exportDir}/${filename}`, JSON.stringify(data), (err) => {
        if (err) console.log(err);
        else console.log('JSON file write successfull in ' + exportDir);
    });
}

const start = async (connectionString, language, exportDir) => {
    const { filePathList = [], data = [] } = await getDataFromDB(connectionString, language)

    writeAudioPaths(filePathList);

    writeDataJson(data, exportDir);
}

const main = () => {
    const language = process.argv[2] || 'English';

    const connectionString = process.argv[3] || '';

    const exportDir = process.argv[4];

    console.log(language, connectionString, exportDir);

    start(connectionString, language, exportDir)
}

main()

module.exports = { main }
