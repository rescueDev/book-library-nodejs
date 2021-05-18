exports.booksIndex = (req, res, next) => {
  res.render("books", {
    linkPath: "/books",
    titlePage: "Books",
  });
};
