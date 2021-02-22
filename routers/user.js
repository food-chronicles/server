const router = require("express").Router();
const UserController = require("../controllers/UserController");

// router.get("/", (req, res) => {
//   res.send("home page");
// });

router.post("/login", UserController.login);

router.post("/register", UserController.register);

module.exports = router;
