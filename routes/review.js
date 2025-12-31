import express from 'express';
const router = express.Router({mergeParams: true});

import wrapAsync from '../utils/wrapAsync.js'; 
import { isLoggedIn, isReviewAuthor, validateReview } from '../middleware.js';
import { createReview, destroyReview } from '../controllars/reviews.js';


// post review route
router.post("/", isLoggedIn , validateReview, wrapAsync(createReview));

// delete review route 
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(destroyReview));


export default router;