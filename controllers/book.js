const { ObjectID } = require("bson");
const mongoose = require("mongoose");
const Book = require("../models/book");
const Author = require("../models/author");
const book = require("../models/book");
const e = require("express");

exports.booksHome = (req, res, next) => {
  //last five added books
  Book.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("author")
    .then((books) => {
      res.render("home", {
        books: books,
        path: "/",
        titlePage: "Home",
      });
    })
    .catch((err) => console.log(err));
};

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
  res.render("admin/book-create", {});
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
  const price = req.body.price;

  //check if author exist if not create one

  Author.findOneAndUpdate(
    { name: { $regex: new RegExp("^" + author + "$", "i") } },
    { name: author, $push: { books: bookId } },
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
      price: price,
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

exports.showBook = (req, res, next) => {
  const bookId = req.params.bookId;

  Book.findOne({ _id: bookId })
    .populate("author")
    .then((book) => {
      res.render("show-book", {
        titlePage: "Book",
        book: book,
      });
    })
    .catch((err) => console.log(err));
};

exports.getEditBook = (req, res, next) => {
  const bookId = req.params.bookId;
  console.log("id di book da editare", bookId);
  console.log("req admin", req.admin);
  //find book to edit
  Book.findOne({ _id: bookId })
    .populate("author")
    .then((book) => {
      res.render("admin/book-edit", {
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
  const newPrice = req.body.price;
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
      book.price = newPrice;

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

exports.deleteBook = (req, res, next) => {
  const bookId = req.params.bookId;

  Book.findById(bookId)
    .populate("author")
    .then((book) => {
      return Author.findOne({ name: book.author.name })
        .then((author) => {
          console.log("author on delete book", author);

          //if author has no books delete author too

          const newBooks = author.books.filter((book) => {
            return book._id != bookId;
          });

          if (newBooks.length <= 0) {
            console.log("filtered books", newBooks);
            console.log("no books for this author");
            //delete author with no books
            author.remove();
          } else {
            author.books = newBooks;
            console.log("author books after filter", author.books);
            //save new author books
            author.save();
          }
          return;
        })
        .then(() => {
          book.remove();
          console.log("deleted successfully");
        })
        .then(() => {
          res.redirect("/books");
        });
    })
    .catch((err) => console.log(err));
};
