const { spawn } = require('child_process');

const calculateSNR = async (command) => {
    console.log('Running command:' + command)
    const workerProcess = spawn(command, { shell: true })
    var snr = -1
    try {
        snr = await new Promise((resolve, reject) => {
            workerProcess.stdout.on('data', async function (data) {
                console.log('stdout: ' + data);
                resolve(parseFloat((data + '').split(' ')[0]))
            })

            workerProcess.stderr.on('data', function (data) {
                console.log('stderr: ' + data);
                reject(data)
            });
        });
    } catch (err) {
        console.log(err)
        throw EvalError('Problem in calculating SNR')
    }

    return snr
};


module.exports = { calculateSNR }

