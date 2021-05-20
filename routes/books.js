const express = require("express");
const router = express.Router();

//import controllers
const booksController = require("../controllers/book");

router.get("/books", booksController.booksIndex);
router.get("/add-book", booksController.addBookPage);
router.post("/add-book", booksController.addBook);

module.exports = router;
