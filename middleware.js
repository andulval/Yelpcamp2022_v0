const { campgroundSchema, reviewSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError.js");
const Campground = require("./models/campground");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //req.isAuthenticated() jest dodane przez 'passport'
    req.session.returnTo = req.originalUrl; //req.orginalUrl jest w obiekcie req
    // console.log("req.isAuthenticated", req.session);
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.validateCampground = (req, res, next) => {
  //3 argumenty, wiec dla Expressa to middleware
  console.log(req.body);
  const { error } = campgroundSchema.validate(req.body); //sprawdzenie obieku z request do naszego schema powyżej, wykorzystanie Joi
  if (error) {
    console.log("ERROR FROM JOI!!!!!!");
    const msg = error.details.map((el) => el.message).join(","); //w obiekcie Joi jest tablica z obiektami, w przpyadku wielu bledów, dlatego tu musimy zrobił łączenie wielu obiektów w przypadku wystąpienia kilku obiektów w tej tablicy
    throw new ExpressError(msg, 400);
  } else {
    next(); //jesli bez błedów przej dalej (do kolejnej middleware if exist)
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    // paszport tworzy: req.user
    req.flash("error", `You don't have permission to do that!`);
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body); //sprawdzamy obiekt wg utworzonego schematu w Joi
  if (error) {
    const msg = error.details.map((el) => el.message).join(","); //w obiekcie Joi jest tablica z obiektami, w przpyadku wielu bledów, dlatego tu musimy zrobił łączenie wielu obiektów w przypadku wystąpienia kilku obiektów w tej tablicy
    throw new ExpressError(msg, 400);
  } else {
    next(); //jesli bez błedów przej dalej (do kolejnej middleware if exist)
  }
};

module.exports.isAuthorOfReview = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    // paszport tworzy: req.user
    req.flash("error", `You don't have permission to do that!`);
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.checkReturnUrl = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;//add query to a loacal (variable beetwen middleware when are called) (campground id redirected to add a comment)
  }
  // console.log("checkReturnUrl session", req.session.returnTo);
  // console.log("checkReturnUrl locals", res.locals.returnTo);
  next();
}
