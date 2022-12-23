if (process.env.NODE_ENV !== "production") {
  //when coding we are in development/production mode so take variable from .env file
  require("dotenv").config();
}
const path = require("path"); //moduł w Node.js ktory złacza  stringi w sciezki dostepow zebysmy my nie musieli sie bawic w łaczenie stringów
const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places, basicImages, defaultAuthors, defaultComment } = require("./seedHelpers"); //destructure
const dbUrl = process.env.DB_URL|| "mongodb://127.0.0.1:27017/yelp-camp"; //process.env.DB_URL;//uzytkownik cluster0 z mongodb atlas
const Review = require("../models/review");

mongoose
  .connect(dbUrl, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO connection!");
  })
  .catch((err) => {
    console.log("MONGO error!", err);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)]; //return watrosc przeslanej tablicy o wylosowanym numerze

const reviewGenerator = async () => {
    const randomComment = sample(defaultComment);
    const newRandomReview = new Review({
      author: sample(defaultAuthors),
      body: randomComment.body,
      rating: randomComment.rating,
    });
  await newRandomReview.save();
  // const review = new Review(req.body.review); //name="review[body]" is parsed in body
  // review.author = req.user._id; //z passport mamy - req.user -> i dzieki temu dodajemy nowego uzytkownika
  // const campground = await Campground.findById(id);
  // campground.reviews.push(review);
  // await review.save();
  // await campground.save();
  // console.log('review created:', review);
  return newRandomReview;
}

const seedsDB = async () => {
  await Campground.deleteMany({}); //delete everything
  await Review.deleteMany({}); //delete everything
  // console.log("reviewsWrong:");
  // console.log((reviewGenerator(Math.floor(Math.random() * 3)+1)));

  const price = Math.floor(Math.random() * 30) + 10;
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    
    const newRandomCamp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: "Point",
        coordinates: [cities[random1000].longitude, cities[random1000].latitude]
      },
      images: [
        sample(basicImages),
        sample(basicImages),
        // {
        //   url: "https://res.cloudinary.com/ddlzbo6ut/image/upload/v1669919262/YelpCamp/tmdufysakjaa1ljkfu3p.jpg",
        //   filename: "YelpCamp/tmdufysakjaa1ljkfu3p",
        //   // _id: new ObjectId("6388f223bcd05896e0fdd3a0"),
        // },
        // {
        //   url: "https://res.cloudinary.com/ddlzbo6ut/image/upload/v1669919263/YelpCamp/cj8ox07izypgs6bitb5i.jpg",
        //   filename: "YelpCamp/cj8ox07izypgs6bitb5i",
        //   // _id: new ObjectId("6388f223bcd05896e0fdd3a1"),
        // },
      ],
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quisquam dignissimos ut asperiores quos voluptatibus fuga rerum beatae cumque minus corrupti incidunt ipsum maxime quibusdam esse, mollitia soluta sed blanditiis laboriosam?",
      price, //shortcut, jesli maja taka samą nazwe -> price: price
      author: sample(defaultAuthors), //, "639dbd5f8a7fe1096f1db304" "63825a24b040d5089b172ecd",
    });
    const reviewsQty = Math.floor(Math.random() * 3)+1;
    for (let i = 0; i < reviewsQty; i++) {
      newRandomCamp.reviews.push(await reviewGenerator());
    }
    // console.log(reviewGenerator());
    // for (let i = 0; i < 1; i++) {
    //   const randomComment = sample(defaultComment);
    //   const newReview = new Review({
    //     author: sample(defaultAuthors),
    //     body: randomComment.body,
    //     rating: randomComment.rating,
    //   })
    //   await newReview.save();
    //   newRandomCamp.reviews.push(newReview);
    // }
    // console.log(newRandomCamp.populate("reviews"))
    await newRandomCamp.save();
  }
};

seedsDB().then(() => {
  //seedsDB jest async wiec zwraca promise
  mongoose.connection.close(); //zamknij database
});
