const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const ExpressError=require("./utils/ExpressError.js");

module.exports.isLoggedIn=(req,res,next)=>{
      // if user is not authenticated, than flash error msg and redirect to /login
     if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be Logged in first!");
        return res.redirect("/login");
     }
     next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
     if(req.session.redirectUrl){
       res.locals.redirectUrl=req.session.redirectUrl;
     }
     next();
};

// to check if curr user is owner of listing
module.exports.isOwner= async (req,res,next)=>{
     let {id}=req.params;
     let listing= await Listing.findById(id);
     if(!(req.user && listing.owner.equals(req.user._id))){
          req.flash("error","You dont have permission to make changes, only listing owner can make changes");
          return res.redirect(`/listings/${id}`);
     }
     next();
};

// middleware to validate listing
module.exports.validateListing=(req,res,next)=>{
      if( req.body.listing.category &&!Array.isArray(req.body.listing.category)) {
        req.body.listing.category = [req.body.listing.category];
      }
      let {error} = listingSchema.validate(req.body);
       if(error){
          let errMsg=error.details.map((el)=>el.message).join(",");
          throw new ExpressError(400,errMsg);
       }
       else{
        next();
       }
}


// validate reviewSchema
module.exports.validateReview=(req,res,next)=>{
      let {error} = reviewSchema.validate(req.body);
       if(error){
          let errMsg=error.details.map((el)=>el.message).join(",");
          throw new ExpressError(400,errMsg);
       }
       else{
        next();
       }
}
// to check if curr user is author of review
module.exports.isAuthor= async (req,res,next)=>{
     let {id,reviewId}=req.params;
     let review= await Review.findById(reviewId);
     if(!(req.user && review.author.equals(req.user._id))){
          req.flash("error","You dont have permission to make changes, only review author can make changes");
          return res.redirect(`/listings/${id}`); // redirect to show page
     }
     next();
};