const express = require("express");
const router = express.Router();

const authorsController = require("../controllers/author");

router.get("/authors", authorsController.authorsIndex);
router.get("/add-author", authorsController.getAddAuthor);
router.post("/add-author", authorsController.addAuthor);

module.exports = router;
