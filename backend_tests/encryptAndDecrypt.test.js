const crypto = require('../src/encryptAndDecrypt');
describe('crypto', function() {
  describe('decrypt()', function() {
    test('should return the same mesage text after decryption of text encrypted with a key generated from a password', function() {
      const plaintext = 'my message text';
      const encryptText = crypto.encrypt(plaintext);
      const decryptOutput = crypto.decrypt(encryptText);
      
      expect(decryptOutput).toBe(plaintext);
    });

    test('should return undefined if text is not defined', function() {
      const encryptText = crypto.encrypt();
      const decryptOutput = crypto.decrypt(encryptText);

      expect(encryptText).toBe(undefined);
      expect(decryptOutput).toBe(undefined);
    });
  });
});
