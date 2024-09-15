const User = require("../models/user");

// sign up get --> req send using form
module.exports.signupGetUsers = (req, res) => {
  res.render("users/signup.ejs");
};

// sign up post --> after send using form form of req by the user
module.exports.signupPostUsers = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password); // sign up done also we can login directly
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash(
        "success",
        `Welcome, ${username.toUpperCase()}! You are logged-in`
      );
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

//============LOGIN ROUTES===============
module.exports.loginUsersOne = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.loginUsersPost = async (req, res) => {
  let { username } = req.body;
  req.flash("success", `Welcome ,${username.toUpperCase()}! You are logged-in`);
  let redirectUrl = res.locals.redirectUrl || "/listings"; // if originalUrl exist then use lelo ya fir "/listings" me redirect kr do
  res.redirect(redirectUrl);
};

// logout Route
module.exports.logoutUsers = (req, res, next) => {
  // predefine method is here from passport
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged you out!");
    res.redirect("/listings");
  });
};
