const { calculateSNR } = require('../../src/audio_attributes/snr');
const { async } = require('regenerator-runtime');
// const { validateUserInputAndFile, validateUserInfo, convertIntoMB } = require('../src/middleware/validateUserInputs')


describe('SNR ', function () {
    describe('calculateSNR()', function () {
        test('should return the snr', done => {
            const command = 'echo 4.0 mock_output mock_output'
            const onSuccess = jest.fn((snr) => {
                console.log('snr:' + snr);
                expect(snr).toBe(4);
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
