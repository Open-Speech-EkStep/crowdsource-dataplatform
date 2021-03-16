const { spawn } = require('child_process');

const calculateSNR = async (command, onSuccess, onError) => {
    console.log('Running command:' + command)
    const workerProcess = spawn(command, { shell: true })
    workerProcess.stdout.on('data', async function (data) {
        console.log('stdout: ' + data);
        const snr = parseFloat((data + '').split(' ')[0])
        onSuccess(snr)
    })

    workerProcess.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
        onError(-1)
    });
};


module.exports = { calculateSNR }

