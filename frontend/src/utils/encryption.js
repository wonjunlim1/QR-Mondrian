import CryptoJS from "crypto-js";

const secretKey = process.env.REACT_APP_CRYPTO_JS_KEY;

// Function to encode parameters from url
export const encryptUrlParams = (decodedMessage) => {
  let cipherText = CryptoJS.AES.encrypt(
    decodedMessage.toString(),
    secretKey
  ).toString();

  let base64 = btoa(cipherText);
  let encodedMessage = base64
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return encodedMessage;
};

// Function to decode parameters from url
export const decryptUrlParams = (encodedMessage) => {
  let base64Reversed =
    encodedMessage.replace(/-/g, "+").replace(/_/g, "/") +
    "=".repeat((4 - (encodedMessage.length % 4)) % 4);
  let cipherTextReversed = atob(base64Reversed);
  let bytes = CryptoJS.AES.decrypt(cipherTextReversed, secretKey);
  let decodedMessage = bytes.toString(CryptoJS.enc.Utf8);

  return decodedMessage;
};