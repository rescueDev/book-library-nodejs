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
  //check if author exist in authors collection by id

  const title = req.body.title;
  const description = req.body.description;
  const publishDate = req.body.publishDate;
  const pageCount = req.body.pageCount;
  const createdAt = new Date();
  const author = req.body.author;

  Author.find({ name: author })
    .then((authorFinded) => {
      let authorId;
      console.log(
        "🚀 ~ file: book.js ~ line 36 ~ Author.find ~ author",
        authorFinded
      );
      const authorToAdd = new Author({ name: author, _id: authorId });
      if (authorFinded.length <= 0) {
        console.log("author not found");
        authorId = new ObjectID();
        console.log("id per author non trovato", authorId);
        authorToAdd.save();
      } else {
        console.log("author exists", authorFinded[0]._id);
        authorId = authorFinded[0]._id;
        console.log("id per author trovato", authorId);
      }
      // return authorId;
      //create book
      const book = new Book({
        title: title,
        description: description,
        publishDate: publishDate,
        pageCount: pageCount,
        createdAt: createdAt,
        author: authorToAdd,
      });
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
    })

    .catch((err) => {
      console.log(err);
    });
};
