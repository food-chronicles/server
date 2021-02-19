const router = require("express").Router();
const ProductController = require("../controllers/ProductController");

router.get("/", ProductController.get);

router.get("/:id", ProductController.getOne);

router.post("/", ProductController.createBlockchain);

router.put("/:id", ProductController.addBlock);

module.exports = router;
