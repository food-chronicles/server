const Product = require("../models/product");
const mongoose = require("mongoose");
const { Blockchain, Block, checkValid } = require("../blockchain/index");
const { checkValidate } = require("../blockchain/checkValidate");

class Controller {
  static get(req, res) {
    Product.find()
      .then((products) => {
        res.status(200).json(products);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }

  static getOne(req, res) {
    Product.findById()
      .then((product) => {
        if (!product) {
          res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }

  static createBlockchain(req, res) {
    let blockchain = new Blockchain();
    blockchain.addBlock(new Block(1, new Date(), req.body.data));

    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      chain: blockchain.chain,
    });
    product
      .save()
      .then((result) => {
        res.status(201).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }

  static async addBlock(req, res) {
    try {
      const { id } = req.params;
      const doc = await Product.findById(id);
      if (doc) {
        const status = checkValidate(doc);
        if (status) {
          const latestBlock = doc.chain[doc.chain.length - 1];
          const newBlock = new Block(
            latestBlock.index + 1,
            new Date(),
            req.body,
            latestBlock.hash
          );
          const newChain = [...doc.chain, newBlock];
          const result = await Product.where({ _id: doc._id })
            .update({ chain: newChain })
            .exec();
          res.status(200).json({ message: `${result.n} doc has been updated` });
        } else {
          throw { message: `You data has been compromised or altered` };
        }
      }
    } catch (error) {
      res.status(500).json({ error: err });
    }
  }
}

module.exports = Controller;
