const SHA256 = require("crypto-js/sha256");

function checkValidate(doc) {
  for (let i = 1; i < doc.chain.length; i++) {
    const currentBlock = doc.chain[i];
    const previousBlock = doc.chain[i - 1];
    const {
      index,
      timestamp,
      data,
      previousHash,
      nonce,
      location,
      image_url,
      user,
    } = currentBlock;

    if (
      currentBlock.hash !==
      calculateHash(
        index,
        timestamp,
        data,
        previousHash,
        nonce,
        location,
        image_url,
        user
      )
    ) {
      return false;
    } else if (currentBlock.previousHash !== previousBlock.hash) {
      return false;
    } else {
      return true;
    }
  }
}

function calculateHash(
  index,
  timestamp,
  data,
  previousHash,
  nonce,
  location,
  image_url,
  user
) {
  return SHA256(
    index +
      previousHash +
      timestamp +
      data +
      nonce +
      location +
      image_url +
      user
  ).toString();
}

module.exports = {
  checkValidate,
  calculateHash,
};
