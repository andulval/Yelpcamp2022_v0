const path = require("path"); //moduł w Node.js ktory złacza  stringi w sciezki dostepow zebysmy my nie musieli sie bawic w łaczenie stringów
const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places, basicImages } = require("./seedHelpers"); //destructure

mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO connection!");
  })
  .catch((err) => {
    console.log("MONGO error!", err);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)]; //return watrosc przeslanej tablicy o wylosowanym numerze


const seedsDB = async () => {
  await Campground.deleteMany({}); //delete everything
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
      author: "63825a24b040d5089b172ecd",
    });

    await newRandomCamp.save();
  }
};

seedsDB().then(() => {
  //seedsDB jest async wiec zwraca promise
  mongoose.connection.close(); //zamknij database
});
