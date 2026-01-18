const express = require("express");
const UserController = require("../controller/user-controller");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/register", UserController.Register);
router.post("/login", UserController.Login);
router.get("/fetch-profile", auth, UserController.getUserProfile);
router.post("/logout", auth, UserController.Logout);

module.exports = router;
