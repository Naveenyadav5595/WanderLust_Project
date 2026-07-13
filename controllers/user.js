const User=require("../models/user.js");

module.exports.getsignUp=(req,res)=>{
      res.render("users/signup.ejs");
};

module.exports.postsignUp=async (req,res)=>{
      try {
           //extract username,email, password from req body
         let {username,email,password}=req.body;
         const newUser=new User({email,username});
         const registeredUser= await User.register(newUser,password);
         req.login(registeredUser,(err)=>{
            if(err){
                  return next(err);
            }
            req.flash("success","Welcome to WanderLust!");
            res.redirect("/listings");
         });
      } catch(e){
          req.flash("error",e.message);
          res.redirect("/signup");
      }
};

module.exports.getlogin=(req,res)=>{
      res.render("users/login.ejs");
};

module.exports.postlogin=async (req,res)=>{
       req.flash("success","Welcome back to WanderLust!");
       let RedirectUrl=res.locals.redirectUrl || "/listings";
       res.redirect(RedirectUrl);
};

module.exports.getlogout=(req,res,next)=>{
     req.logout((err)=>{
        if(err){
           return  next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
     });
};