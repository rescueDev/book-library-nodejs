const express = require("express");
const router = express.Router();

const authorsController = require("../controllers/author");

router.get("/authors", authorsController.authorsIndex);
router.get("/add-author", authorsController.getAddAuthor);
router.post("/add-author", authorsController.addAuthor);
router.get("/author/:authorId", authorsController.showAuthor);
router.get("/edit-author/:authorId", authorsController.getEditAuthor);
router.post("/edit-author", authorsController.editAuthor);
router.post("/delete-author/:authorId", authorsController.deleteAuthor);

module.exports = router;
