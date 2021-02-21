const Product = require("../models/product");
const User = require("../models/user");
const mongoose = require("mongoose");
const { Blockchain, Block, checkValid } = require("../blockchain/index");
const { checkValidate } = require("../blockchain/checkValidate");
const randomize = require("randomatic");

class Controller {
  static async get(req, res) {
    try {
      const { id } = req.headers.user;
      const user = await User.findById(id);
      const { _id, username, company_name, category, history } = user;
      res.status(200).json({
        _id,
        username,
        company_name,
        category,
        history,
      });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }

  static async getOne(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      if (!product) {
        throw { type: "Product not found" };
      }
      res.status(200).json(product);
    } catch (err) {
      if (err.type) {
        res.status(404).json({ message: "Product not found" });
      } else {
        res.status(500).json({ error: err });
      }
    }
  }

  static async createBlockchain(req, res) {
    try {
      if (Object.keys(req.body.data).length === 0 && req.body.name) {
        throw { message: "data must not empty" };
      }
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
      if (Object.keys(req.body.data).length === 0 && !req.body.name) {
        res.status(403).json({ message: "data and name must not empty" });
      } else {
        res.status(403).json(error);
      }
    }
  }

  static async addBlock(req, res) {
    try {
      console.log(req.body);
      if (Object.keys(req.body).length === 0) {
        throw { type: "data must not empty" };
      }
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
          throw { type: `You data has been compromised or altered` };
        }
      }
    } catch (err) {
      if (err.type) {
        res.status(403).json({ message: err.type });
      } else {
        res.status(500).json({ error: err });
      }
    }
  }
}

module.exports = Controller;
