// restructuring user routes

const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport");
const {saveRedirectUrl} =require("../middleware.js");
const userControllers=require("../controllers/user.js");

// get request on /signup--> a form will open, once submitted, a post request will be sent on /signup
router.get("/signup",userControllers.getsignUp);

router.post("/signup", wrapAsync(userControllers.postsignUp));

// get req on /login --> a form will open user fill its detail and submit --> a post req sent on /login
router.get("/login",userControllers.getlogin);

router.post("/login",saveRedirectUrl, passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userControllers.postlogin);

// for logout
router.get("/logout",userControllers.getlogout);

module.exports=router;
