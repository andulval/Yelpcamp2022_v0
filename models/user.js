const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const Campground = require("./review");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  campgrounds: [
    {
      type: Schema.Types.ObjectId,
      ref: "Campground",
    },
  ]
});

UserSchema.plugin(passportLocalMongoose); //dodaje username i password z hash za nas

module.exports = mongoose.model("User", UserSchema);
