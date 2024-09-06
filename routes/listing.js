const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing");

// schema.js validation server side for individual post

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// =======listing route====

router.get("/", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
});

//====New route====

router.get("/new", (req, res) => {
  res.render("./listings/new.ejs");
});

//====show route====
router.get("/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews"); // Fetch listing from database
  res.render("./listings/show.ejs", { listing }); // Rendering the template but not passing 'listing'
});

// create Route

router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
    let listing = req.body.listing;
    let new_listing = new Listing(listing);
    await new_listing.save();
    res.redirect("/listings");
  })
);

//edit route
router.get("/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("./listings/edit.ejs", { listing });
});
//update post method
router.put("/:id", async (req, res) => {
  let { id } = req.params;
  let updateListing = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });
  res.redirect(`/listings`);
});

//delete route

router.delete("/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

//export
module.exports = router;

// NOTE -> Major problems see that app.js can be bulky code therefore we have solution that we can create routes folder -> there are mutiple routes like listing.js, review.js and all the routes linked on the app.js -->
