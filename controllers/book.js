const Book = require("../models/book");

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

// exports.addBookPage = (req, res, next) => {
//   res.render("book-create");
// };

// exports.addBook = (req, res, next) => {
//   const title = req.body.title;
//   const description = req.body.description;
//   const publishDate = req.body.publishDate;
//   const pageCount = req.body.pageCount;
//   const createdAt = new Date();
//   const author_id = new mongodb.ObjectId();
//   const author = req.body.author;

//   //create book
//   const book = new Book(
//     title,
//     description,
//     publishDate,
//     pageCount,
//     createdAt,
//     author_id
//   );
//   book
//     .save()
//     .then((book) => {
//       console.log(book);
//     })
//     .then(() => {
//       const authorToSave = new Author(author, author_id);
//       console.log("id di author", authorToSave._id);
//       authorToSave
//         .save(authorToSave.name)
//         .then((author) => {
//           console.log("saved author", author);
//           return author;
//         })
//         .catch((err) => console.log(err));
//     })
//     .then(() => {
//       res.redirect("/books");
//     })
//     .catch((err) => console.log(err));
// };
