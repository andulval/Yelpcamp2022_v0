const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  const review = new Review(req.body.review); //name="review[body]" is parsed in body
  review.author = req.user._id; //z passport mamy - req.user -> i dzieki temu dodajemy nowego uzytkownika
  const campground = await Campground.findById(id);
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "Created new review!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  const review = await Review.findByIdAndDelete(reviewId);
  const camp = await Campground.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId }, //delete an element with review': 'reviewId' from array
  });
  req.flash("success", "Successfully deleted review!");
  res.redirect(`/campgrounds/${id}`);
};
