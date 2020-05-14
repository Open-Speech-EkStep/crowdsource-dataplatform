const assert = require('assert');
const crypto = require('../src/encryptAndDecrypt');
describe('crypto', function() {
  describe('decrypt()', function() {
    it('should return the same mesage text after decryption of text encrypted with a key generated from a password', function() {
      let plaintext = 'my message text';
      let encryptText = crypto.encrypt(plaintext);
      const decryptOutput = crypto.decrypt(encryptText);
      
      assert.equal(decryptOutput, plaintext);
    });

    it('should return undefined if text is not defiend', function() {
      let encryptText = crypto.encrypt();
      let decryptOutput = crypto.decrypt(encryptText);

      assert.equal(encryptText, undefined);
      assert.equal(decryptOutput, undefined);
    });
  });
});