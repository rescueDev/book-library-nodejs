const Author = require("../models/author");

exports.authorsIndex = (req, res, next) => {
  Author.find()
    .then((authors) => {
      console.log("autori", authors);
      res.render("authors", {
        authors: authors,
        titlePage: "author",
        linkPath: "/authors",
      });
    })

    .catch((err) => console.log(err));
};

exports.getAddAuthor = (req, res, next) => {
  res.render("author-create");
};

exports.addAuthor = (req, res, next) => {
  const name = req.body.name;

  const author = new Author({ name: name });

  //save new author
  author
    .save()
    .then(() => {
      res.redirect("/authors");
    })
    .catch((err) => console.log(err));
};
