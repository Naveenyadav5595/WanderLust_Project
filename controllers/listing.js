const Listing=require("../models/listing.js");
const Booking=require("../models/booking.js");
const geocoder = require("../init/geocoder");

module.exports.indexRoute= async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.newFormRoute=(req,res)=>{
      res.render("listings/new.ejs")
};

module.exports.showRoute=async (req,res)=>{
   let {id}=req.params; // extract id
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner"); // find data on the basis of id and store in listing
    if(!listing){
       req.flash("error","This Listing does not exist");
       res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.createRoute=async (req,res,next)=>{
         console.log("Inside createRoute");
        let url=req.file.path;
        let filename=req.file.filename;
        const newListing=new Listing(req.body.listing);
        let location = `${newListing.location}, ${newListing.country}`;
      try {
         let response = await geocoder.geocode(location);
         if (response.length > 0) {
            newListing.geometry = {type: "Point",coordinates: [response[0].longitude, response[0].latitude], };
         } else {
           newListing.geometry = {type: "Point", coordinates: [0, 0],};
         }
         }catch (err) {
            newListing.geometry = {
               type: "Point",
               coordinates: [0, 0],
            };
         }
        newListing.owner=req.user._id,
        newListing.image={url,filename};
        await newListing.save();
        req.flash("success","New Listing Created!");
        res.redirect("/listings");
};

module.exports.editRoute=async (req,res)=>{
   let {id}=req.params; // extract id
   const listing = await Listing.findById(id);
    if(!listing){
       req.flash("error","This Listing does not exist");
       res.redirect("/listings");
    }
    let originalUrl=listing.image.url;
    originalUrl=originalUrl.replace("/upload","/upload/h_200,w_300");
   res.render("listings/edit.ejs",{listing,originalUrl});
};

module.exports.updateRoute=async (req,res)=>{
    let {id}=req.params; 
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!="undefined"){
       let url=req.file.path;
       let filename=req.file.filename;
       listing.image={url,filename};
       await listing.save();
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteRoute=async (req,res)=>{
    let {id}=req.params;  
    let deletedListing=  await Listing.findByIdAndDelete(id);
   req.flash("success","Listing Deleted!");
   res.redirect("/listings");
};

module.exports.filterCategory = async (req, res) => {
    const { category } = req.params;
    const allListings = await Listing.find({
        category: category
    });
    res.render("listings/index.ejs", { allListings });
};

module.exports.searchListing = async (req, res) => {
   const search = req.query.search;
   const allListings = await Listing.find({$or: [{ title: { $regex: search, $options: "i"}}, {location: { $regex: search,$options: "i" }}, {country: {$regex: search,$options: "i"}}] });
   if(allListings.length===0){
      req.flash("error","No listings found.");
      return res.redirect("/listings");
   }
   res.render("listings/index.ejs", { allListings });
};

module.exports.availabilityRoute=async (req,res)=>{
     const {id}=req.params;
     const listing=await Listing.findById(id);
     console.log(listing);
      if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
      }
     res.render("listings/availabilityCheck.ejs",{listing});
};


module.exports.checkAvailabilityRoute=async (req,res)=>{
   const { id } = req.params;
   const {checkIn,checkOut,guests} = req.body;
   const listing = await Listing.findById(id);
   if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
   }
    // Convert dates
   const newCheckIn = new Date(checkIn);
   const newCheckOut = new Date(checkOut);
   const today = new Date().toISOString().split("T")[0];
   if (checkIn < today) {
      req.flash("error","Check-in date cannot be in the past.");
      return res.redirect(`/listings/${id}/checkAvailability`);
   }
      // Validate dates
   if (newCheckIn >= newCheckOut) {
      req.flash(
         "error",
         "Check-out must be after check-in."
      );
      return res.redirect(
         `/listings/${id}/checkAvailability`
      );
   }
    // Validate guests
   if (guests < 1) {
        req.flash(
            "error",
            `Atleast 1 guests must be present`
        );
        return res.redirect(
            `/listings/${id}/checkAvailability`
        );
   }
   // find booking from Booking model whose id=id
   const bookings = await Booking.find({
     listing: id,
     status: { $in: ["pending", "confirmed"] }
   });
   
    // Check overlap
   const isOverlapping = bookings.some((booking) => {
        return (
            newCheckIn < booking.checkOut &&
            newCheckOut > booking.checkIn
        );
   });

   // if overlapping
   if (isOverlapping) {
        req.flash(
            "error",
            "Sorry, this listing is not available for these dates."
        );
        return res.redirect(
            `/listings/${id}/checkAvailability`
        );
   }
   // listing is avalibale procecd for booking
   const timeDifference = newCheckOut - newCheckIn;
   const nights = Math.ceil(
      timeDifference / (1000 * 60 * 60 * 24)
   );
   //calculating total price=listingprice*nights
   const totalPrice = listing.price * nights;
   return res.render("bookings/summary.ejs", {
    listing,
    checkIn: newCheckIn,
    checkOut: newCheckOut,
    guests,
    nights,
    totalPrice
   });
};