const Author = require("../models/author");
const Book = require("../models/book");

exports.booksIndex = (req, res, next) => {
  Book.fetchAll()
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

  //create book
  const book = new Book(
    title,
    description,
    publishDate,
    pageCount,
    createdAt,
    author
  );
  book
    .save()
    .then((book) => {
      console.log(book);

      res.redirect("/books");
    })
    .catch((err) => console.log(err));
};
