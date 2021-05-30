const express = require("express");
const router = express.Router();

//import controllers
const userController = require("../controllers/user");

router.get("/signup", userController.getSignUp);
router.post("/signup", userController.postSignUp);
router.get("/login", userController.getLogin);
router.post("/login", userController.postLogin);

module.exports = router;
