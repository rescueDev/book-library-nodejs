const User = require("../models/user");
const Book = require("../models/book");
const bcrypt = require("bcryptjs");

exports.getSignUp = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "auth/signup",
    titlePage: "signup",
    errorMessage: message,
  });
};

exports.postSignUp = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  //check if user exist in db before creating one
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        req.flash("error", "Email exists already, please pick a different one");
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
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "login",
    titlePage: "Login",
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        //login fails display errors
        req.flash("error", "Invalid email, please retry");
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
            console.log("errors post login?", err);
            res.redirect("/");
          });
        }
        req.flash("error", "Password does not match, please retry");
        return res.redirect("/login");
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  console.log("session before beeen destroyed", req.session);

  req.session.destroy((err) => {
    console.log("session destroyed", req.session);
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

exports.removeFromCart = (req, res, next) => {
  const bookId = req.params.bookId;
  console.log("book id", bookId);
  Book.findById(bookId)
    .then((book) => {
      console.log("book to remove from cart", book);
      return req.user.removeFromCart(book);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.clearCart = (req, res, next) => {
  return req.user.clearCart().then((result) => {
    console.log("all cleared");
    res.redirect("/cart");
  });
};
