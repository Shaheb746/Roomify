
import Listing from "../model/listing.js";
import Review from "../model/reviews.js";

export const createReview = async(req, res)=>{
  let listing = await Listing.findById(req.params.id);
  let newReviews = new Review(req.body.review);
  newReviews.author = req.user._id;
  listing.reviews.push(newReviews)

  await newReviews.save();
  await listing.save();
  req.flash("success", "New Review Created"); 
  res.redirect(`/listings/${req.params.id}`)
};

export const destroyReview = async(req, res) => {
  let {id, reviewId} = req.params;
  await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted");
  res.redirect(`/listings/${id}`);
};