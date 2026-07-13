const Listing=require("../models/listing.js");
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
        console.log(req.body.listing);
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
   console.log(deletedListing);
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
