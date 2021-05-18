//Import
const mongodb = require("mongodb");
const mongoConnect = require("./utils/database").mongoConnect;
const express = require("express");
require("dotenv").config();

//create app instance
const app = express();

//set the view engine to ejs
app.set("view engine", "ejs");

//home page route
app.get("/", (req, res, next) => {
  res.render("home");
});

//import routes
const booksRoutes = require("./routes/books");
app.use(booksRoutes);

//connect instance mongodb
mongoConnect((client) => {
  console.log(client);
  app.listen(3000);
});
