const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync.js");
const Campground = require("../models/campground");
const Review = require("../models/review");
const campgrounds = require("../controllers/campgrounds");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const multer = require("multer"); //do dodania do requestu obiektu z uwzględnieniem plików załaczonych w form, rowniez pola teskstowe
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router.route("/").get(catchAsync(campgrounds.index)).post(
  isLoggedIn,
  upload.array("image"), //upload.single("/image") dodaje do req.body file z parametrem name='image'
  validateCampground, //po zaladowaniu obrazow bo tam nastepuje parsowanie i wyrzucenie req.body. Mozliwe że Colt zmieni to potem
  catchAsync(campgrounds.createCampground)
);

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
