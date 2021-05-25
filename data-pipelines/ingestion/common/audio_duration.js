const { spawn } = require('child_process');

const calculateDuration = async (command) => {
    console.log('Running command:' + command)
    const workerProcess = spawn(command, { shell: true })
    const promise = new Promise((resolve, reject) => {
        workerProcess.stdout.on('data', async function (data) {
            console.log('stdout: ' + data);
            const duration = parseFloat(data.toString())
            const rounded = Math.round(duration * 100) / 100
            resolve(rounded);
        })

        workerProcess.stderr.on('data', async function (data) {
            console.log('stderr: ' + data);
            reject(data)
        })
    })
    return promise
}


module.exports = { calculateDuration }

