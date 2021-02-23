const router = require("express").Router();
const UserController = require("../controllers/UserController");
const authentication = require("../middlewares/authentication");

router.get("/ping", (req, res) => {
  res.send("pong");
});
router.post("/login", UserController.login);
router.post("/register", UserController.register);

router.use(authentication);

router.get("/user", UserController.getUserInfo);
router.put("/user", UserController.updateUserInfo);

module.exports = router;
