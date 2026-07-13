// restructuring review -- basically moving review routes from app.js to ../routes/review.js

const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const {validateReview,isLoggedIn,isAuthor}=require("../middleware.js");
const reviewControllers=require("../controllers/review.js");


// reviews  post route
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewControllers.reviewPost));

// reviews delete route
router.delete("/:reviewId",isLoggedIn,isAuthor, wrapAsync(reviewControllers.reviewDelete));

module.exports=router;