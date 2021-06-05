module.exports = (req, res, next) => {
  //if user is not an Admin redirect to login
  if (!req.user.isAdmin === true) {
    return res.redirect("/login");
  }
  next();
};
