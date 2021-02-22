const router = require("express").Router();
const UserController = require("../controllers/UserController");
const authentication = require("../middlewares/authentication");

router.get("/ping", (req, res) => {
  res.send("pong");
});

router.get("/user", authentication, UserController.getUserInfo);
router.post("/login", UserController.login);
router.post("/register", UserController.register);

module.exports = router;
