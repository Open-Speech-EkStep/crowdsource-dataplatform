const { calculateSNR } = require('../../src/audio_attributes/snr');
const { async } = require('regenerator-runtime');
const fs = require('fs');

describe('SNR ', function () {
    describe('calculateSNR()', function () {
        test('should return the snr', done => {
            // var numberOfLineBreaks = (enteredText.match(/\n/g)||[]).length;

            const output = fs.readFileSync('./backend_tests/audio_attributes/output.log', 'utf8');
            const command = `echo "${output}"`
            const onSuccess = jest.fn((snr) => {
                expect(snr).toBe(4.25);
                done();
            })
            const onError = jest.fn()
            calculateSNR(command, onSuccess, onError)
        });

        test('should throw error if wada process fails', done => {
            const command = 'ech 4.0 mock_output mock_output'
            const onSuccess = jest.fn()
            const onError = jest.fn((snr) => {
                console.log('snr:' + snr);
                expect(snr).toBe(-1);
                done();
            })
            calculateSNR(command, onSuccess, onError)
        });
    });
});
