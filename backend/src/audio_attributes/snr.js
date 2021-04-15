const { spawn } = require('child_process');

const calculateSNR = async (command, onSuccess, onError) => {
    console.log('Running command:' + command)
    const workerProcess = spawn(command, { shell: true })
    workerProcess.stdout.on('data', async function (data) {
        console.log('stdout: ' + data);
        const lines = data.toString().split(/\n/g);
        const snr = parseFloat(lines.slice(-3, -2)[0].split(' ')[3])
        const rounded = Math.round(snr * 100) / 100
        onSuccess(rounded)
    })

    workerProcess.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
        onError(-1)
    });
};


module.exports = { calculateSNR }

