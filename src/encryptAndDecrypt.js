const CryptoJS = require('crypto-js');
const key = process.env.ENCRYPTION_KEY;
const keyutf = CryptoJS.enc.Utf8.parse(key);
const iv = CryptoJS.enc.Base64.parse(key);

const encrypt = function (text) {
    if (!text) return text;
    let encrypted = CryptoJS.AES.encrypt(text, keyutf, { iv: iv });
    return encrypted.toString()
}

const decrypt = function (text) {
    if (!text) return text;
    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: CryptoJS.enc.Base64.parse(text) }, keyutf,
        { iv: iv });
    const decryptedString = CryptoJS.enc.Utf8.stringify(decrypted);
    return decryptedString;
}

module.exports = {
    decrypt,
    encrypt

}
