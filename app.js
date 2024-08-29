require('dotenv').config()
const express = require("express");
const app = express();
const port = 4000;
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonder";

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname , "/public")));
// to parse the data -->
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to the root");
});

// =======listing route====

app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
});

//====New route====

app.get("/listings/new", (req, res) => {
  res.render("./listings/new.ejs");
});

//====show route====
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id); // Fetch listing from database
  res.render("./listings/show.ejs", { listing }); // Rendering the template but not passing 'listing'
});

app.post("/listings", async (req, res) => {
  let listing = req.body.listing;
  let new_listing = new Listing(listing);
  await new_listing.save();
  res.redirect("/listings");
});

//edit route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("./listings/edit.ejs", { listing });
});
//update post method
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let updateListing = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });
  res.redirect(`/listings`);
});

//delete route

app.delete("/listings/:id", async(req, res)=>{
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");

})

// process.env.PORT-> its help in deployemnt of the project and its enhence the security of the PORT and databases

app.listen(process.env.PORT, () => {
  console.log("Listening on port 4000");
});
