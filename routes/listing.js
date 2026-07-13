// restructuring listing -- basically moving listing routes from app.js to ../routes/listing.js

const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn}=require("../middleware.js");
const {isOwner}=require("../middleware.js");
const {validateListing}=require("../middleware.js");
const listingControllers=require("../controllers/listing.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});

// whenever express sees req start from /listings it will use listing.js like --> /listings/new == /new
//index route
router.get("/", wrapAsync(listingControllers.indexRoute));

// route to search detinations
router.get("/search", listingControllers.searchListing);

// new route
// create button-> click->get request send to /listings/new-> a form open->user fills data->post req sent to /listing
router.get("/new", isLoggedIn,listingControllers.newFormRoute);

// show route --> get request --> to return all data
router.get("/:id", wrapAsync(listingControllers.showRoute));

//Create Route
router.post("/",isLoggedIn,upload.single("listing[image]"),validateListing ,wrapAsync(listingControllers.createRoute));

// edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingControllers.editRoute));

//update route
router.put("/:id",isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingControllers.updateRoute));

// Delete route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingControllers.deleteRoute));

// specific show route
router.get("/category/:category", listingControllers.filterCategory);


module.exports=router;