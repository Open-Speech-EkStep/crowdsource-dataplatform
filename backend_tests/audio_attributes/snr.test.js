const { calculateSNR } = require('/Users/rajats/projects/ekstep/crowdsource-dataplatform/src/audio_attributes/snr');
const { async } = require('regenerator-runtime');
// const { validateUserInputAndFile, validateUserInfo, convertIntoMB } = require('../src/middleware/validateUserInputs')

describe('SNR ', function () {
    describe('calculateSNR()', function () {
        test('should return the snr', async function () {
            // const command = `/Users/rajats/projects/ekstep/crowdsource-dataplatform/binaries/WadaSNR/Exe/WADASNR -i ${filename} -t /Users/rajats/projects/ekstep/crowdsource-dataplatform/binaries/WadaSNR/Exe/Alpha0.400000.txt -ifmt mswav`
            const command = 'echo 4.0 mock_output mock_output'
            const snr = await calculateSNR(command)

            expect(snr).toBe(4.00);
        });

        test('should throw error if wada process fails', async function () {
            const command = 'ech 4.0 mock_output mock_output'
            try {
                await calculateSNR(command)
            } catch (err) {
                console.log(err.message)
                expect(err.message).toBe('Problem in calculating SNR')
            }
        });
    });
});
