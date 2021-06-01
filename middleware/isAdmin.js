module.exports = (req, res, next) => {
  console.log(req.user);
  //if user is not an Admin redirect to login
  if (!req.user.isAdmin === true) {
    return res.redirect("/login");
  }
  next();
};
