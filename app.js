//USers in mongo Atlas: // user Toni, Kel

if (process.env.NODE_ENV !== "production") {
  //when coding we are in development/production mode so take variable from .env file
  require("dotenv").config();
}

const express = require("express");
const path = require("path"); //moduł w Node.js ktory złacza  stringi w sciezki dostepow zebysmy my nie musieli sie bawic w łaczenie stringów
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); //engine which make sense for ejs-> run, parsing or just making sense. ejs-mate umożliwia podział htmla na kawałki które potem używasz wszędzie - lepsza opcja 'partials'
const ExpressError = require("./utils/ExpressError.js");

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const mongoSanitize = require('express-mongo-sanitize'); //to prevent hacker attacks, to inject mongoDB spepcific symblos like $ and . -> $gt:"" -> ktory wyszukalby wszystko jesli dane dalej sluza do wsyszukania w naszej DB
// By default, $ and . characters are removed completely from user-supplied input in the following places:
// - req.body, req.params, req.headers, req.query
const helmet = require("helmet");//Helmet helps you secure your Express apps by setting various HTTP headers
const dbUrl = process.env.DB_URL|| "mongodb://127.0.0.1:27017/yelp-camp"; //process.env.DB_URL;//uzytkownik cluster0 z mongodb atlas
const session = require('express-session');
const MongoDBStore = require('connect-mongo');//MongoDB session store for Connect and Express written in Typescript
const secret = process.env.SECRET || 'thisshouldbeabettersecret';

const campgroundsRoutes = require("./routes/campgrounds");
const reviewsRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");

const app = express();

app.engine("ejs", ejsMate); //aby express uzył tego silnika zamiast defaultowego
app.set("view engine", "ejs"); //ze mamy templatke html'ów w rozwinieciu EJS a nie innym z możliwych
app.set("views", path.join(__dirname, "views")); //ustawienie scieżki absolutnej - aby mozna bylow wywolac script nie bedac w foderze głównym, a applikacja znajdowała pliki
app.use(mongoSanitize());
app.use(helmet());//{crossOriginOpenerPolicy: false, contentSecurityPolicy: false, crossOriginEmbedderPolicy: false}

const scriptSrcUrls = [ //for helmet package - which locations are allowed 
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
    "https://cdn.jsdelivr.net/"
];
const fontSrcUrls = ["https://cdn.jsdelivr.net/"];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/ddlzbo6ut/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


app.use(express.urlencoded({ extended: true })); //parse dadne z <form> (złącz) ->nie dostajemy z form submit od razu obiektu - musimy wymagac tego od express
//any data from FORM plese parse it (złącz) ->   for parsing application/x-www-form-urlencoded
app.use(methodOverride("_method")); //za kazdym requestem sie wywołuje. Przeszukuje czy w query danego requesta znajduje sie ustawiony przez nas wyraz np. _method i zmienia request z GET/ POST (tylko takie moze wyslac <form>) na zadany przez nas )
//poniżekj wysyłamy przy kazdym requescie pliki zawarte w danym folderze - public, czyli skrypty i CSS
app.use(express.static(path.join(__dirname, "public"))); //ustawienie scieżki absolutnej - aby mozna bylow wywolac script nie bedac w foderze głównym, a applikacja znajdowała pliki
app.use(flash());

const store = new MongoDBStore({
  mongoUrl: dbUrl,
  secret: secret,
  touchAfter: 24 * 60 *60
});
store.on("error", function (e) {
  console.log("Session STORE ERROR!", e)
});

const sessionConfig = {
  store, //the same as-> store: store
  name: 'yelpcamp_session', //zmiana nazwy z defaultowej zeby nie tak latwo wykryc co haker chcialby tu uzyc w cookies
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true, //dla bezpieczenstwa, zeby nie mozna bylo uzyc skryptu u klienta i wywnioskować jego sesji - 
    // secure: true, przy deployu powinno byc zalaczone, zeby tylko https czyli secure połączenie mogło edytowac cookie's. localhost nie jest secure dlatego cookies by nie dzialaly nam
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //expire po tygodniu od teraz - aby uzytkownik musial sie co jakis czas logować
    maxAge1000: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //chcemy uzyc sesje na localhost, i dodajemyna obiekt User metode authenticate
passport.serializeUser(User.serializeUser()); //jak store dane user'a w session
passport.deserializeUser(User.deserializeUser()); //jak usuwac dane user w session

app.use((req, res, next) => {//midlleware odpalane dla kazdego requesta
  res.locals.success = req.flash("success"); //w zmiennej res.locals przekazywane są automatycznie do kazdego 'view', wiec nie ma potrzeby przekazywania obiektu flash przy każdym wywołaniu res.render(..)
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user; //req.user from passport
  // res.locals.returnTo = req.session.returnTo;
  // console.log(req.session.returnTo);
  next();
});

app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);
app.use("/", userRoutes);

mongoose
  .connect(dbUrl, {//dbUrl //"mongodb://127.0.0.1:27017/yelp-camp"
    //useNewUrlParser, useUnifiedTopology, useFindAndModify, and useCreateIndex are no longer supported options. Mongoose 6 always behaves as if useNewUrlParser, useUnifiedTopology, and useCreateIndex are true, and useFindAndModify is false. Please remove these options from your code.
    // useNewUrlParser: true, From the Mongoose 6.0 docs:
    // useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false
  })
  .then(() => {
    console.log("MONGO connection!");
  })
  .catch((err) => {
    console.log("MONGO error!", err);
  });

app.get("/", (req, res) => {
  res.render("home.ejs");
});

//dla wszystkich requestów się uaktywnia, jeśli request nie został przechwycony wcześniej - kluczowa jest pozycja w kodzie - ta linijka! po wszystkich route'ach
app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404)); //odbiera request z route'em który nie jest przewidziany, tworzy obiekt Error z nowymi parametrami i przerzuca go dalej - next(e) -> czyli do nastepnej error handle middlaware
});

//error handlers middlewares
app.use((err, req, res, next) => {
  //for arguments means that express use it as error hanler middleware, when error will occure express will triger this function (no normal middleware)
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("error.ejs", { err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serving at PORT ${port}`);
});
