const router = require("express").Router();
const ProductController = require("../controllers/ProductController");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");

router.get("/:id", ProductController.getOne);

router.use(authentication);

router.get("/", ProductController.get);

router.post("/", ProductController.createBlockchain);

router.put("/:id", authorization, ProductController.addBlock);

module.exports = router;
