//Import
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

//create app instance
const app = express();

//body parser for incoming data req
app.use(bodyParser.urlencoded({ extended: false }));

//set the view engine to ejs
app.set("view engine", "ejs");

//import routes
const booksRoutes = require("./routes/books");
const authorsRoutes = require("./routes/authors");

//home page route
app.get("/", (req, res, next) => {
  res.render("home");
});

app.use(booksRoutes);
app.use(authorsRoutes);

//connect instance mongoose
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5vg5z.mongodb.net/bookLibrary?retryWrites=true&w=majority`,
    { useNewUrlParser: true }
  )
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
