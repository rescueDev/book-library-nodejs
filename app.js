//Import
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const User = require("./models/user");
require("dotenv").config();

//import routes
const booksRoutes = require("./routes/books");
const authorsRoutes = require("./routes/authors");
const userRoutes = require("./routes/user");

const MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5vg5z.mongodb.net/bookLibrary?retryWrites=true&w=majority`;

//create app instance
const app = express();

//store mongodb session
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

//body parser for incoming data req
app.use(bodyParser.urlencoded({ extended: false }));

//session middleware
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
//set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", "views");

//home page route
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      //store user in every request through each middleware
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});
app.get("/", (req, res, next) => {
  res.render("home", {
    isAuthenticated: req.session.isLoggedIn,
  });
});

app.use(booksRoutes);
app.use(authorsRoutes);
app.use(userRoutes);

//connect instance mongoose
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("connected");
    app.listen(3000);
  })
  .catch((err) => console.log(err));
