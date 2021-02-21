const Product = require("../models/product");

const authorization = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    const latestBlockKey = product.chain[product.chain.length - 1].key;
    const { qr, key } = req.headers;
    console.log(qr, key, latestBlockKey);
    if (key === latestBlockKey) {
      next();
    } else {
      throw { type: "QR code and key is not match" };
    }
  } catch (err) {
    if (err.type) {
      res.status(403).json({ message: err.type });
    }
    res.status(500).json({ error: err });
  }
};

module.exports = authorization;
