var express=require("express");
var router=express.Router();
var defaultController=require("../controller/defaultController");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var bcrypt=require("bcryptjs");
var User=require("../models/UserModel");
var Comment=require("../models/postmodel");
const Category=require("../models/categoryModel");

router.all('/*', (req, res, next) => {
    
    req.app.locals.layout = 'default';
    
    next();
});




// we are extracting the callback function from defaultController Route which is in controller directory
// this is the root route
router.route("/")
.get(defaultController.index);
// about me page 

// defining the local strategy
passport.use( new LocalStrategy({
    usernameField:"email",
    passReqToCallback:true

},(req,email,password,done)=>{
    User.findOne({email:email}).then (user=>{

        if (!user){
            return done(null,false,req.flash("error-message","User not found with this email"));
        }
         bcrypt.compare(password,user.password,(err,passwordmatched)=>{
             if (err)
             {
                return err;
             }
        if (!passwordmatched)
        {
            return done(null,false,req.flash("error-message","invalid username or password"));
        }
          return done (null,user,req.flash("success-message","Login Successful"));
         });
    });

}));
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
   
  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
// Login Route get
router.route("/login")
.get(defaultController.loginGet);
// login route post
router.route("/login")
.post(passport.authenticate("local",{
    successRedirect:"/admin",
    failureRedirect:"/login",
    failureFlash:true,
    successFlash:true,
    session:true
}),defaultController.loginPost);

//register routes  GET
router.route("/register")
.get(defaultController.registerGet);
//register route POST
router.route("/register")
.post(defaultController.registerPost);
// show route for all posts

router.route("/post/:id")
.get(defaultController.getSinglePost);
// route for submitting comments
router.route("/post/:id")
.post(defaultController.submitComment);
module.exports=router;
// logout for users goes here 
router.get("/logout",(req,res)=>{
    req.logout();
    req.flash("success-message","logout was successful")
    res.redirect("/");
})