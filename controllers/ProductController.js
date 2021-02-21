const Product = require("../models/product");
const User = require("../models/user");
const mongoose = require("mongoose");
const { Blockchain, Block, checkValid } = require("../blockchain/index");
const { checkValidate } = require("../blockchain/checkValidate");
const randomize = require("randomatic");

class Controller {
  static async get(req, res, next) {
    const searchFilter = req.query.search ?? "";
    try {
      const { id } = req.headers.user;
      const user = await User.findById(id);
      const products = user.history.filter((product) => {
        return (
          product._id.includes(searchFilter) ||
          product.name.toLowerCase().includes(searchFilter.toLowerCase())
        );
      });
      res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  }

  static async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      console.log("prod", product);
      const productDataChain = product.chain.map((block) => {
        return { timestamp: block.timestamp, data: block.data };
      });

      if (!product) {
        next({ name: "ProductNotFound" });
      }

      res.status(200).json({ name: product.name, chain: productDataChain });
    } catch (err) {
      next(err);
    }
  }

  static async createBlockchain(req, res) {
    try {
      let blockchain = new Blockchain();
      const { id } = req.headers.user;
      await blockchain.addBlock(new Block(1, new Date(), req.body.data));

      const product = await Product.create({
        name: req.body.name,
        chain: blockchain.chain,
      });

      const user = await User.findById(id).exec();
      await User.updateOne(
        { _id: id },
        { history: [...user.history, { _id: product._id, name: product.name }] }
      );
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json(error);
    }
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
            latestBlock.hash,
            randomize("Aa0", 12)
          );
          const newChain = [...doc.chain, newBlock];
          const result = await Product.where({ _id: doc._id })
            .updateOne({ chain: newChain })
            .exec();
          res.status(200).json({ message: `${result.n} doc has been updated` });
        } else {
          throw { message: `You data has been compromised or altered` };
        }
      }
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
}

module.exports = Controller;
