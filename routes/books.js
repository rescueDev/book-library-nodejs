const express = require("express");
const router = express.Router();

//import controllers
const booksController = require("../controllers/book");

router.get("/books", booksController.booksIndex);
router.get("/add-book", booksController.addBookPage);
router.post("/add-book", booksController.addBook);
router.get("/edit-book/:bookId", booksController.getEditBook);
router.post("/edit-book", booksController.editBook);
router.post("/delete-book/:bookId", booksController.deleteBook);

module.exports = router;
