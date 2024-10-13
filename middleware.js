const Listing = require("./models/listing");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  // if you are not logged in so first of all go and logg in
  if (!req.isAuthenticated()) {
    // save-> redirect originalURL
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be login to create post");
    return res.redirect("/login");
  }
  next();
};
// WE CREATE ANOTHER MIDDLEWARE THAT CAN HELP TO SAVE THE REDIRECTuRL THAT CAN NOT BE REMOVE BY THE PASSPORT THEREFORE WE STORE IN LOCALS
 
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async(req, res ,next)=>{
  let { id } = req.params;
  const listing = await Listing.findById(id);
  // Check if the logged-in user is the owner of the listing
  if (!req.user || !listing.owner.equals(req.user._id)) {
    req.flash("error", "You do not have permission to any operation with this post.");
    return res.redirect(`/listings/${id}`);
  }
  next();
}
module.exports.isReviewAuthor = async(req, res ,next)=>{
  let { reviewId ,id} = req.params;
  const review = await Review.findById(reviewId);
  // Check if the logged-in user is the owner of the listing
  if (!review.author || !review.author.equals(req.user._id)) {
    req.flash("error", "Sorry ! You do not have permission to delete another comments");
    return res.redirect(`/listings/${id}`);
  }
  next();
}