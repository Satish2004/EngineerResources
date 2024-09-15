if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const port = 4000;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const dbUrl = process.env.ATLASDB_URL;
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// Rouetr Require-->
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
// to parse the data -->
app.use(express.urlencoded({ extended: true })); // for url

// conect-mongo
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60, // after 24hrs
});

store.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

// express-session
const sessionOptions = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  // there are diffrect type of cookie -> check express-session
  cookie: {
    // today -> 7days -> date.now()-> milisecond me hota hai +(day)*(houres)*(min)*(sec)*(milisec);

    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // for security purpose
  },
};

app.use(session(sessionOptions));
app.use(flash());
// passport use also session but passport code should be after the session
app.use(passport.initialize()); // from the passport for initialize
app.use(passport.session()); // from the passport se for session page to page but login only once
// use static authenticate method of model in LocalStrategy-> docs
// authenticate karna means -> user ko signup and login krwana

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/////////////////////////////////////////////////

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user || null;

  next();
});

// // demo user route
// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({  // create a fake user
//     email: "student2@gmail.com",
//     username: "satish",
//   });
//   // and then register it-->
//   let registeredUser = await User.register(fakeUser, "helloworld");
//   res.send(registeredUser);
// });

//ROUTERS==============>>>>>>>>
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);
// to show custome erro.ejs

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong" } = err;
  res.render("./listings/error.ejs", { err });
});

app.listen(port, () => {
  console.log("Listening on port 4000");
});
