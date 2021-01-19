const crypto = require('../src/encryptAndDecrypt');
describe('crypto', function() {
  describe('decrypt()', function() {
    test('should return the same mesage text after decryption of text encrypted with a key generated from a password', function() {
      let plaintext = 'my message text';
      let encryptText = crypto.encrypt(plaintext);
      const decryptOutput = crypto.decrypt(encryptText);
      
      expect(decryptOutput).toBe(plaintext);
    });

    test('should return undefined if text is not defined', function() {
      let encryptText = crypto.encrypt();
      let decryptOutput = crypto.decrypt(encryptText);

      expect(encryptText).toBe(undefined);
      expect(decryptOutput).toBe(undefined);
    });
  });
});
