const User = require("../models/user");
const Book = require("../models/book");
const bcrypt = require("bcryptjs");

exports.getSignUp = (req, res, next) => {
  res.render("signup", {
    path: "/signup",
    titlePage: "signup",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postSignUp = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  //check if user exist in db before creating one
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        return res.redirect("/signup");
      }
      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      //if not exist create new one with hashed password
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: { items: [] },
      });
      //save user
      return user.save();
    })
    .then((result) => {
      res.redirect("login");
    });
};

exports.getLogin = (req, res, next) => {
  res.render("login", {
    path: "/login",
    titlePage: "Login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        //login fails
        return res.redirect("/login");
      }

      bcrypt.compare(password, user.password).then((doMatch) => {
        //if passwords do match
        if (doMatch) {
          //create new session for this user
          req.session.isLoggedIn = true;
          req.session.user = user;

          //save session
          return req.session.save((err) => {
            console.log(err);
            res.redirect("/");
          });
        }
        return res.redirect("/login");
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log("errors:", err);
    res.redirect("/");
  });
};

exports.getCart = (req, res, next) => {
  console.log("cart user", req.user.cart);
  req.user
    .populate("cart.items.bookId")
    .execPopulate()
    .then((user) => {
      res.render("cart", {
        path: "/cart",
        titlePage: "Cart",
        cart: user.cart,
        isAuthenticated: req.session.isLoggedIn,
      });
    });
};

exports.addToCart = (req, res, next) => {
  const bookId = req.params.bookId;
  console.log("book id", bookId);
  Book.findById(bookId)
    .then((book) => {
      console.log("book inside controller", book);
      return req.user.addToCart(book);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};
