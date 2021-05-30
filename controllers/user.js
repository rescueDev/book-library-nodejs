const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getSignUp = (req, res, next) => {
  res.render("signup", {
    path: "/signup",
    titlePage: "signup",
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
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      console.log(user);
    })
    .catch((err) => console.log(err));
};
