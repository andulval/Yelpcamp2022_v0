const express = require("express");
const router = express.Router({ mergeParams: true }); //zeby express łączył query w linku łącznie z sciezką podaną przy routes w app.js
const catchAsync = require("../utils/catchAsync.js");
const Campground = require("../models/campground");
const Review = require("../models/review");
const {
  isLoggedIn,
  validateReview,
  isAuthorOfReview,
} = require("../middleware");
const reviews = require("../controllers/reviews");

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isAuthorOfReview,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
