const Author = require("../models/author");
const Book = require("../models/book");

exports.authorsIndex = (req, res, next) => {
  Author.find()
    .populate("books")
    .then((authors) => {
      res.render("authors", {
        authors: authors,
        titlePage: "author",
        linkPath: "/authors",
        isAuthenticated: req.session.isLoggedIn,
      });
    })

    .catch((err) => console.log(err));
};

exports.getAddAuthor = (req, res, next) => {
  res.render("author-create");
};

exports.addAuthor = (req, res, next) => {
  const name = req.body.name;

  Author.findOneAndUpdate(
    { name: name },
    { name: name },
    { new: true, upsert: true }
  )
    .then((author) => {
      console.log(author);
      return author;
    })
    .then(() => {
      res.redirect("/authors");
    })
    .catch((err) => console.log(err));
};

exports.showAuthor = (req, res, next) => {
  const authorId = req.params.authorId;

  Author.findOne({ _id: authorId })
    .populate("books")
    .then((author) => {
      res.render("show-author", {
        titlePage: "Author",
        author: author,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.getEditAuthor = (req, res, next) => {
  const authorId = req.params.authorId;
  Author.findOne({ _id: authorId })
    .then((author) => {
      res.render("author-edit", {
        author: author,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.editAuthor = (req, res, next) => {
  const newName = req.body.name;
  const authorId = req.body.authorId;

  Author.findOne({ _id: authorId })
    .then((author) => {
      author.name = newName;
      console.log("author modified", author);
      return author.save();
    })

    .then(() => {
      console.log("author edited and saved");
      res.redirect("/authors");
    });
};

exports.deleteAuthor = (req, res, next) => {
  const authorId = req.params.authorId;
  Author.findById(authorId)
    .then((author) => {
      console.log("author to delete", author);
      Book.remove({ author: { _id: authorId } })
        .then((book) => {
          console.log("book to delete on cascade", book);
        })
        .catch((err) => console.log(err));
      return author.remove();
    })
    .then(() => {
      res.redirect("/authors");
    })
    .catch((err) => console.log(err));
};
