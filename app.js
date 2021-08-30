//Import
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const multer = require("multer");
const csrf = require("csurf");
const bcrypt = require("bcryptjs");
const flash = require("connect-flash");
const path = require("path");
require("dotenv").config();

//import routes
const booksRoutes = require("./routes/books");
const authorsRoutes = require("./routes/authors");
const userRoutes = require("./routes/user");
const User = require("./models/user");
const { ObjectId } = require("bson");

const MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.phggk.mongodb.net/bookLibrary?retryWrites=true&w=majority`;

//create app instance
const app = express();
const csrfProtect = csrf();

//store mongodb session
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

//file storage multer
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

//multer filter file uploaded
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.urlencoded({ extended: false }));
//body parser for incoming data req
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

//session middleware
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(flash());

//set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", "views");

app.use(csrfProtect);

//create admin user
app.use((req, res, next) => {
  const adminId = mongoose.Types.ObjectId("60b607707ed11a343ef9f473");
  User.findOne({
    _id: adminId,
  }).then((checkAdmin) => {
    if (!checkAdmin) {
      return bcrypt.hash("admin", 12).then((passHash) => {
        const user = new User({
          _id: adminId,
          email: "admin@admin.com",
          password: passHash,
          isAdmin: true,
        });
        return user
          .save()
          .then((admin) => {
            console.log("admin user created", admin);
            req.admin = admin;
            next();
          })
          .catch((err) => console.log(err));
      });
    }
    next();
  });
});

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

//csrf token protection and auth middleware
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();

  //if no user has logged in yet check
  if (!req.session.user) {
    res.locals.isAdmin = false;
  } else {
    res.locals.isAdmin = req.session.user.isAdmin;
  }

  next();
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
