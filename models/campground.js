const mongoose = require("mongoose");
const { cloudinary } = require("../cloudinary");
const Schema = mongoose.Schema;
const Review = require("./review");
const {basicImages} = require('../seeds/seedHelpers.js')

const ImageSchema = Schema({
  //tworzymy Schema dla Images tylko po to aby dodac virtuals ponizej - tylko na Schema jest taka mozliwosc
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  //dodajemy na kazdym obiekcie Image metode 'thumbnail' ktora zmienia url aby cloudinary API dawało nam tylko pomniejszony obrazek
  return this.url.replace("/upload", "/upload/w_120");
});

const CampgroundSchema = Schema({
  title: String,
  images: [ImageSchema],
  geometry: {
    type: {
      type: String,
      enum: ["Point"], //co daje ze musi byc "Point",
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
}, {toJSON: {virtuals: true}});

CampgroundSchema.virtual("properties").get(function () {
  //dodajemy na kazdym obiekcie Campground metode 'properties' w której są dane Campgrounda w formacie odpowiadającym Mapbox'owi
  const campData = {
    title: this.title,
    location: this.location,
    link: this._id,
    imgThumbnail: this.images[0].url,
  }
  return campData;
});


//kiedy odpala sie funkcja findOneadnDelete uruchamia sie z automaru ta funkcja
CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc.reviews.length) {
    //if array with reviews exist (campground has any reviews)
    await Review.deleteMany({
      //usun powiazane reviews do usuwanego wlasnie campground'a
      _id: {
        $in: doc.reviews, //id znajdujące się w array campground'a
      },
    });
  }
  if (doc.images.length > 0) {
    //usun zdjecia z cloudinary - wszystkie przynalezne temu campground'owi
    
    //create array of filenames pulled from basicImages(array of objects)
    //const array = someArray.map(x => x.data)
    const defaultImgs = basicImages.map(x => x.filename); //Destructuring array of objects
    // console.log('defaultImgs: ', defaultImgs)
    // console.log('doc.images: ', doc.images)
    for (let img of doc.images) {
        //new array with img to delete without default ones:
        
            if(!defaultImgs.includes(img.filename)){//if default array of img obeject include image selected to delete then..
              console.log('in campgroundsModel delete img from cloudinary: ', img.filename)
              await cloudinary.uploader.destroy(img.filename); 
          }  
    }
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema); //create mongoosowy obiekt z wytycznymi z Schema
