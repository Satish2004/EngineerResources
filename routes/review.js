const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware.js");
const { isReviewAuthor } = require("../middleware.js");
// Reviews controller---->
const listingController = require("../controllers/reviews.js");

// Schema.js validation server-side for reviews
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Post review route
// review validate hone se pahle chekc karawo ki wo logged in hai ki nahi then use aage ki process kro
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(listingController.postReviews)
);

// Delete review route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(listingController.destroyReviews)
);

module.exports = router;
