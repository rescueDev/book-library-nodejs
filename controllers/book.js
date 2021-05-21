const { ObjectID } = require("bson");
const mongoose = require("mongoose");
const Book = require("../models/book");
const Author = require("../models/author");

exports.booksIndex = (req, res, next) => {
  Book.find()
    .populate("author")
    .then((books) => {
      res.render("books", {
        linkPath: "/books",
        titlePage: "Books",
        books: books,
      });
    })
    .catch((err) => console.log(err));
};

exports.addBookPage = (req, res, next) => {
  res.render("book-create");
};

exports.addBook = (req, res, next) => {
  //request incoming data
  const bookId = new ObjectID();
  const title = req.body.title;
  const description = req.body.description;
  const publishDate = req.body.publishDate;
  const pageCount = req.body.pageCount;
  const createdAt = new Date();
  const author = req.body.author.toUpperCase();

  //check if author exist if not create one

  Author.findOneAndUpdate(
    { name: { $regex: new RegExp("^" + author + "$", "i") } },
    { name: author },
    { new: true, upsert: true }
  ).then((author) => {
    //create book
    const book = new Book({
      _id: bookId,
      title: title,
      description: description,
      publishDate: publishDate,
      pageCount: pageCount,
      createdAt: createdAt,
      author: author,
    });

    //save book
    book
      .save()
      .then((book) => {
        console.log("saved book", book);
        return book;
      })
      .then(() => {
        res.redirect("/books");
      })
      .catch((err) => console.log(err));
  });
};

exports.getEditBook = (req, res, next) => {
  res.render("book-edit");
};

exports.editBook = (req, res, next) => {};

exports.deleteBook = (req, res, next) => {};
