const campground = require("../models/campground");
const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
  //basic page (all of them)
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index.ejs", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new.ejs");
};
module.exports.createCampground = async (req, res, next) => {
  // if (!req.body.campground)
  //   throw new ExpressError("Invalid Campground Data", 400);
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  // res.send("GEO DATA!", geoData.body.features[0].geometry);
  const newCampground = new Campground(req.body.campground); //normalnie req.body jest puste, musi zostać zpasrsowane (połączone, wyrzucone jako obiekt i nam przekazane). A to robi u góry linijka "router.use(express.urlencoded({ extended: true }))"
  newCampground.geometry = geoData.body.features[0].geometry;
  newCampground.author = req.user._id;
  // console.log("req.files is : ", req.files);
  newCampground.images = req.files.map((f) => ({
    filename: f.filename,
    url: f.path,
  }));
  // console.log("images is : ", newCampground);
  // console.log(f.filename, f.path);
  await newCampground.save();
  req.flash("success", "Successfully made a new campground!");
  res.redirect(`/campgrounds/${newCampground._id}`); //campground._id z własnie zapisanego newCampground
};

module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate("author")
    .populate({ path: "reviews", populate: { path: "author" } });
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    res.redirect("/campgrounds");
  }
  // console.log(campground);
  res.render("campgrounds/show.ejs", { campground });
};
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit.ejs", { campground });
};
module.exports.updateCampground = async (req, res) => {
  // console.log("body to Update", req.body);
  const { id } = req.params;
  const camp = await Campground.findByIdAndUpdate(
    id,
    req.body.campground, //lub rzutowanie: {...req.body.campground}
    { new: true }
  ); // zeby zwrócił nowy zupdatowany obiekt a nie stary przed edycją
  const newImgs = req.files.map((f) => ({
    filename: f.filename,
    url: f.path,
  }));
  camp.images.push(...newImgs); //dodaj nie cala tablice ale jej poszczegole elementy, bo dodanie tablicy w tablicy utworzyłoby niepoprawny obiekt..
  await camp.save();
  console.log("found CAMP", camp);
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      //delete imagees from cloudinary
      await cloudinary.uploader.destroy(filename);
    }
    await camp.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
    //PULL elements from IMAGES array, where values are equal to the ones from deleteIMAGES
    // console.log("after Delete", req.body);
  }
  console.log("After CAMP", camp);
  req.flash("success", "Successfully update a campground!");
  res.redirect(`/campgrounds/${req.params.id}`);
};
module.exports.deleteCampground = async (req, res) => {
  const deletedCampground = await Campground.findByIdAndDelete(req.params.id);
  req.flash("success", "Successfully deleted campground!");
  res.redirect("/campgrounds");
};