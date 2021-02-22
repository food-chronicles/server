const router = require("express").Router();
const UserController = require("../controllers/UserController");

router.get("/ping", (req, res) => {
  res.send("pong");
});

router.post("/login", UserController.login);
router.post("/register", UserController.register);

module.exports = router;
