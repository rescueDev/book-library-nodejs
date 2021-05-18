const express = require("express");
const router = express.Router();

//import controllers
const booksController = require("../controllers/book");

router.get("/books", booksController.booksIndex);

module.exports = router;
