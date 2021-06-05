const express = require("express");
const router = express.Router();
const isAdmin = require("../middleware/isAdmin");

//import controllers
const booksController = require("../controllers/book");

router.get("/", booksController.booksHome);

router.get("/books", booksController.booksIndex);
router.get("/add-book", isAdmin, booksController.addBookPage);
router.post("/add-book", isAdmin, booksController.addBook);
router.get("/book/:bookId", booksController.showBook);
router.get("/edit-book/:bookId", isAdmin, booksController.getEditBook);
router.post("/edit-book", isAdmin, booksController.editBook);
router.post("/delete-book/:bookId", isAdmin, booksController.deleteBook);

module.exports = router;
