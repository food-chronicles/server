const SHA256 = require("crypto-js/sha256");
const randomize = require("randomatic");

class Block {
  constructor(index, timestap, data, previousHash, key) {
    this.index = index; //show the index of this block in the chain
    this.timestap = timestap; //show whan block is created
    this.key = key;
    this.data = data; //hold the information stored in the chain
    this.previousHash = previousHash; //hold the hash of the previous block
    this.hash = this.calculateHash(); //hold the block's own hash
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.index + this.previousHash + this.timestap + this.data + this.nonce
    ).toString();
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesis()];
  }

  createGenesis() {
    return new Block(0, new Date(), "Genesis block", "0", "0");
  }

  latestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.index = this.latestBlock().index + 1;
    newBlock.previousHash = this.latestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    newBlock.key = randomize("Aa0", 12);
    this.chain.push(newBlock);
  }
}

module.exports = {
  Blockchain,
  Block,
};
