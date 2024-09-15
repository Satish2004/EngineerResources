// models/listing.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { type } = require("os");
// create schema
const listingSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  location: String,
  country: String,
  image: {
    url: String,
    filename: String,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming the owner is a User model
  },
});

// post mongoose middleware  jo baad me access hoti hai

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.review } });
  }
});

// then export

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
