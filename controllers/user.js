const User = require("../models/user");
const Book = require("../models/book");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const user = require("../models/user");
require("dotenv").config();

//import nodemailer and sendGrid for email
const nodemailer = require("nodemailer");
const { reset } = require("nodemon");
const { ObjectId } = require("bson");
// const sendGridTransport = require("nodemailer-sendgrid-transport");

let transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

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

exports.getResetPass = (req, res, next) => {
  res.render("auth/reset-password", {});
};

exports.postResetPass = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");

    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found!");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      //send email for resetting
      .then((result) => {
        res.redirect("/");
        transporter.sendMail(
          {
            to: req.body.email,
            from: "bookshop@reset.pass",
            subject: "Password resetting",
            html: `
          <div class='container-fluid text-center'>
            <p>You request a password reset, please click this
               <a href="http://localhost:3000/new-password/${token}"> link </a> 
               to set a new password 
            </p>
          `,
          },
          (err, info) => {
            if (err) {
              console.log(err);
            } else {
              console.log(info);
            }
          }
        );
      })
      .catch((err) => console.log(err));
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  //find user with token in params

  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  }).then((user) => {
    let message = req.flash("error");
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render("auth/new-password", {
      path: "/new-password",
      titlePage: "New Password",
      errorMessage: message,
      userId: user._id.toString(),
      passwordToken: token,
    });
  });
};

exports.postNewPassword = (req, res, next) => {
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  const newPassword = req.body.newPassword;
  let resetUser;
  User.findOne({
    _id: userId,
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      resetUser = user;
      console.log(resetUser);
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPass) => {
      resetUser.password = hashedPass;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => console.log(err));
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
