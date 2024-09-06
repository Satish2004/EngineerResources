const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing");  // <- review added in the listing therefore we require

// schema.js validation server side for reviews
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// review  Express Router

// post review route
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    // console.log(req.params.id);
    let Listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    Listing.review.push(newReview);
    await newReview.save();
    await Listing.save();
    res.redirect(`/listings/${Listing._id}`);
  })
);

// Review Route

//   router.get("/listings/:id", async (req, res) => {
//     try {
//       const listing = await Listing.findById(req.params.id).populate("reviews");
//       res.render("listing", { listing });
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Server Error");
//     }
//   });

// deete review rout

router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  })
);
module.exports = router;
