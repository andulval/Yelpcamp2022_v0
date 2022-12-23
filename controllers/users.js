const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.registerUser = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password); //register - funkcja dodana z passport,
    req.login(registeredUser, function (err) {
      if (err) {
        return next(err);
      }
      console.log(registeredUser);
      req.flash("success", "Welcome to YelpCamp!");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.renderLogin = (req, res) => {
  if (req.query.returnCamp) {
    req.session.returnTo = req.query.returnCamp;//add query to a session (campground id redirected to add a comment)
  }
  // console.log("renderLogin", req.session.returnTo);
  res.render("users/login");
};

module.exports.loginUser = (req, res) => {
  // console.log("loginUser", res.locals.returnTo);
  //res.locals.returnTo nie działa bo passport dziala teraz inaczej - updatuje session id gdy sie logujemy - a wiec resetuje nam zmienną lokalną
  const redirectUrl = res.locals.returnTo || "/campgrounds"; //res.locals.returnTo || "/campgrounds"; //bo returnTo moze byc puste - uzytkownik kliknie w login button, a nie redirected przez naszą logike w routach
  delete req.session.returnTo; //zeby nie zostalo w sesji niepotrzebnie
  req.flash("success", "Log in successfully");
  res.redirect(redirectUrl);
};

module.exports.logoutUser = async (req, res, next) => {
  req.logout(function (err) {
    //from passport
    if (err) {
      req.flash("error", err);
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
};
