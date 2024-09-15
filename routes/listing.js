const express = require("express");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
// const upload = multer({ dest: "uploads/" }); -> pahle yaha store hota tha abb storage ko require karke cloudinary me store kr do
const upload = multer({ storage });

const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");

const { isLoggedIn, isOwner } = require("../middleware.js");
//===========Controller section===============================
const listingController = require("../controllers/listings");

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

// // =======listing route====
// router.get("/", wrapAsync(listingController.index));

//====New route====

router.get("/new", isLoggedIn, listingController.listingNewForm);

// create Route

router.route("/").get(wrapAsync(listingController.index)).post(
  isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.createListings)
);

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListings)
);

//update post method
router
  .route("/:id")
  .get(wrapAsync(listingController.showListings))
  .put(
    isLoggedIn,  
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updatePostListings)
  )
  //delete route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListings));

//export
module.exports = router;

// NOTE -> Major problems see that app.js can be bulky code therefore we have solution that we can create routes folder -> there are mutiple routes like listing.js, review.js and all the routes linked on the app.js -->
