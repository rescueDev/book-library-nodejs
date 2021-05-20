const { ObjectID } = require("bson");
const mongoose = require("mongoose");
const Book = require("../models/book");
const Author = require("../models/author");

exports.booksIndex = (req, res, next) => {
  Book.find()
    .then((books) => {
      console.log(books);

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
  const title = req.body.title;
  const description = req.body.description;
  const publishDate = req.body.publishDate;
  const pageCount = req.body.pageCount;
  const createdAt = new Date();
  const author = req.body.author;
  const authorToAdd = new Author({ name: author, _id: new ObjectID() });

  //create book
  const book = new Book({
    title: title,
    description: description,
    publishDate: publishDate,
    pageCount: pageCount,
    createdAt: createdAt,
    author: authorToAdd,
  });
  authorToAdd.save();
  book
    .save()
    .then((book) => {
      console.log("saved book", book);
      //save author
      return book;
    })

    .then(() => {
      res.redirect("/books");
    })
    .catch((err) => console.log(err));
};
