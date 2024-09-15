const Listing = require("../models/listing");
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// require('dotenv').config(); // Ensure .env is loaded

// const mapToken = process.env.MAP_KEY;

// if (!mapToken) {
//   console.error('Mapbox token is undefined');
// }

// const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// Index Route Controller
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

// New Route
module.exports.listingNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};
// show route

module.exports.showListings = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author", // Populate the author of the reviews
      },
    })
    .populate("owner"); // Fetch listing from database

  if (!listing) {
    req.flash("error", "Listing You Requested For Does Not Exist!!");
    return res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { listing });
};

//Create Route
module.exports.createListings = async (req, res) => {
  // // access of req.file ki puri
  // let response = await geocodingClient
  //   .forwardGeocode({
  //     query: "New Delhi , India",
  //     limit: 1,
  //   })
  //   .send();
  //   console.log(response);
  //   res.send("done!");
  

  let url = req.file.path;
  let filename = req.file.filename;
  let listing = req.body.listing;
  let new_listing = new Listing(listing);
  console.log(req.user);
  new_listing.owner = req.user._id;
  new_listing.image = { url, filename };
  await new_listing.save();
  req.flash("success", "Congratulations! New Listing created!");
  res.redirect("/listings");
};

// Edit Route

module.exports.editListings = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Sorry This Listing Doesn't Exist!!");
    res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_200");
  res.render("./listings/edit.ejs", { listing, originalImageUrl });
};

// update Route

module.exports.updatePostListings = async (req, res) => {
  let { id } = req.params;
  // Perform the update
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

// delete Route
module.exports.deleteListings = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
