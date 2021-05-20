const Author = require("../models/author");

exports.authorsIndex = (req, res, next) => {
  Author.find()
    .then((authors) => {
      res.render("authors", {
        authors: authors,
        titlePage: "author",
        linkPath: "/authors",
      });
    })
    .catch((err) => console.log(err));
};
