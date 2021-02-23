const Product = require("../models/product");
const User = require("../models/user");
const mongoose = require("mongoose");
const getLocation = require("../helpers/getLocation");
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
          product._id.toString().includes(searchFilter) ||
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

      if (!product) {
        return next({ name: "ProductNotFound" });
      }

      const productDataChain = product.chain.map((block) => {
        return {
          timestamp: block.timestamp,
          data: block.data,
          location: block.location,
          image_url: block.image_url,
          user: block.user,
        };
      });

      return res.status(200).json({
        _id: product._id,
        name: product.name,
        chain: productDataChain,
      });
    } catch (err) {
      if (err.name === "CastError") return next({ name: "ProductNotFound" });
      return next(err);
    }
  }

  static async createBlockchain(req, res, next) {
    try {
      if (Object.keys(req.body.data).length === 0 && req.body.name) {
        return next({ name: "ProductDataValidationError" });
      }
      let blockchain = new Blockchain();
      const { id } = req.headers.user;
      const location = await getLocation(req.body.location);
      await blockchain.addBlock(
        new Block(
          1,
          new Date(),
          req.body.data,
          location,
          req.body.image_url,
          req.headers.user
        )
      );

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
        return next({ name: "ProductValidationError" });
      } else {
        return next(error);
      }
    }
  }

  static async addBlock(req, res, next) {
    try {
      if (Object.keys(req.body).length === 0) {
        throw { name: "data must not empty" };
      }
      const { id } = req.params;
      const doc = await Product.findById(id);
      if (doc) {
        const status = checkValidate(doc);
        if (status) {
          const latestBlock = doc.chain[doc.chain.length - 1];
          const location = await getLocation(req.body.location);
          const newBlock = new Block(
            latestBlock.index + 1,
            new Date(),
            req.body.data,
            location,
            req.body.image_url,
            req.headers.user,
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
      if (err.name) {
        return next({ name: "ProductValidationError" });
      } else {
        return next(error);
      }
    }
  }
}

module.exports = Controller;
