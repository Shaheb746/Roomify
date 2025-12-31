import Listing from "./model/listing.js";
import Review from "./model/reviews.js";
import {listenSchema, reviewSchema} from './schema.js'
import ExpressError from './utils/ExpressError.js'


 let isLoggedIn = (req, res, next)=> {
  // console.log(req);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; 
    req.flash("error", "You must be logged in!");
    return res.redirect("/login");
  }
  next();
}

let saveRedirectUrl = (req , res, next) =>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

let isOwner = async(req, res, next)=>{
  let { id } = req.params;
  let listing = await Listing.findById(id)
  console.log("-------------------------------------------------------------------------->");
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission to edit");
    return res.redirect(`/listings/${id}`);
  }
  next()
};

const validateListing = (req, res, next)=>{
  let {error} = listenSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=> el.message).join(",")
    throw new ExpressError(400, errMsg)
  }else{
    next()
  }
};

const validateReview =(req, res, next)=>{
  let {error} = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el)=> el.message).join(",")
    throw new ExpressError(400, errMsg)
  }else{
    next()
  }
}
let isReviewAuthor = async(req, res, next)=>{
  let {id, reviewId } = req.params;
  let review = await Review.findById(reviewId)
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not author of this Review");
    return res.redirect(`/listings/${id}`);
  }
  next()
};


export {isLoggedIn, saveRedirectUrl, isOwner, validateListing, validateReview, isReviewAuthor};
