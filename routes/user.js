const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");

//import controllers
const userController = require("../controllers/user");

router.get("/signup", userController.getSignUp);
router.post("/signup", userController.postSignUp);
router.get("/login", userController.getLogin);
router.post("/login", userController.postLogin);
router.post("/logout", userController.postLogout);

//send email for resetting password
router.get("/reset-password", userController.getResetPass);
router.post("/reset-password", userController.postResetPass);

//pages for resetting password after email link
router.get("/new-password/:token", userController.getNewPassword);
router.post("/new-password", userController.postNewPassword);

router.get("/cart", isAuth, userController.getCart);
router.post("/add-to-cart/:bookId", isAuth, userController.addToCart);
router.post("/remove-from-cart/:bookId", isAuth, userController.removeFromCart);
router.post("/clear-cart", isAuth, userController.clearCart);

module.exports = router;
