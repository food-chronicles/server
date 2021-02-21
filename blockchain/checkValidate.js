const SHA256 = require("crypto-js/sha256");

function checkValidate(doc) {
  for (let i = 1; i < doc.chain.length; i++) {
    const currentBlock = doc.chain[i];
    const previousBlock = doc.chain[i - 1];
    const { index, timestap, data, previousHash, nonce, key } = currentBlock;

    if (
      currentBlock.hash !==
      calculateHash(index, timestap, data, previousHash, nonce)
    ) {
      return false;
    } else if (currentBlock.previousHash !== previousBlock.hash) {
      return false;
    } else {
      return true;
    }
  }
}

function calculateHash(index, timestap, data, previousHash, nonce) {
  return SHA256(index + previousHash + timestap + data + nonce).toString();
}

module.exports = {
  checkValidate,
  calculateHash,
};
