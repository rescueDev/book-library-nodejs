const { ObjectID } = require("bson");
const mongoose = require("mongoose");
const Book = require("../models/book");
const Author = require("../models/author");
const book = require("../models/book");

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
  const bookId = req.params.bookId;
  console.log("id di book da editare", bookId);
  //find book to edit
  Book.findOne({ _id: bookId })
    .populate("author")
    .then((book) => {
      res.render("book-edit", {
        book: book,
      });
    });
};

exports.editBook = (req, res, next) => {
  const bookId = req.body.bookId;
  const newTitle = req.body.title;
  const newDescription = req.body.description;
  const newPublishDate = req.body.publishDate;
  const newPageCount = req.body.pageCount;
  const newAuthor = req.body.author;
  //find the book to update
  Book.findOne({ _id: bookId })
    .populate("author")
    .then((book) => {
      console.log("book to edit", book);
      book.title = newTitle;
      book.description = newDescription;
      book.publishDate = newPublishDate;
      book.pageCount = newPageCount;
      book.author.name = newAuthor;

      //update author linked to the book
      Author.findOneAndUpdate(
        { _id: book.author._id },
        { name: book.author.name },
        { upsert: true, new: true }
      );

      return book.save();
    })
    .then((book) => {
      console.log("book edited and saved", book);
      res.redirect("/books");
    })
    .catch((err) => console.log(err));
};

exports.deleteBook = (req, res, next) => {};
