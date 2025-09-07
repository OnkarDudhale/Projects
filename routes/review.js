const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview } = require('../schema.js');
let wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, isReviewAuthor } = require('../auth.js');
const reviewController=require('../controllers/reviews.js');

//Review
//new route 
router.post('', isLoggedIn, validateReview, wrapAsync(reviewController.newReview));

//DELETE route
router.delete('/:reviewId', isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview));


module.exports = router;