//Import
const mongodb = require("mongodb");
const mongoConnect = require("./utils/database").mongoConnect;
const express = require("express");
const bodyParser = require("body-parser");
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

//connect instance mongodb
mongoConnect((client) => {
  console.log(client);
  app.listen(3000);
});
