const Post=require("../models/postmodel");
const Category=require("../models/categoryModel");
const User=require("../models/UserModel");
const bcrypt = require("bcryptjs");
const Comment=require("../models/CommentModel");

module.exports={
    index: async (req,res)=>{
        const posts= await Post.find();
        const categories=await Category.find();
        res.render("default/index",{posts:posts,categories:categories});
    },
    loginGet:function(req,res){
        res.render("default/login");
    },
  
    loginPost:function(req,res){
        res.send("you hit the post route ");
    },
    registerGet:function(req,res){
       res.render("default/register");
    },
    registerPost:function(req,res){
        //here we put the logic of registrering user 
        let errors=[];
        if (!req.body.firstName)
        {
            errors.push({message:"first name is mandatory"});
        }
        if (!req.body.lastName)
        {
            errors.push({message:"last name is mandatory"});
        }
        if (!req.body.email)
        {
            errors.push({message:"Email field is mandatory"});
        }
        if (req.body.password !== req.body.passwordConfirm)
        {
            errors.push({message:"Passwords dont match"});
        }
        // if there are more than 1 errors ,i want to render the same page with the previously field data
    if (errors.length>0)
    {
        res.render("default/register",{
            errors:errors,
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            email:req.body.email

        });
    }
    else{ 
        User.findOne( {email:req.body.email}).then(user =>
            {
                if (user)
                {
                    req.flash("error-message","Email already exist try  login");
                    res.redirect("/login");
                }
                else{
                    const newUser= new User (req.body);
                    bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        newUser.password=hash;
                        newUser.save().then (user=>{
                            req.flash("success-message","You are now registered");
                            res.redirect("/login");
                        });
                    });
                    });
                }
            });

    }
    },
    getSinglePost:(req,res)=>{
       
        const id=req.params.id;
        Post.findById(id)
        .populate({path:"comments",populate:{path:"user",model:"user"}})
        .then(post=>{
            if(!post){
                res.status(404).json({message:"no post found"});
            }
            else{
                res.render("default/singlePost",{post:post,comments:post.comments});
            }
        })
    },
    submitComment:(req,res)=>{
        if (req.user){
        Post.findById(req.body.id).then(post=>{
            const newComment=new Comment({
                user:req.user.id,
                body:req.body.comment_body
            });
        post.comments.push(newComment);
        post.save().then(savedpost=>{
             newComment.save().then(savedcomment=>{
                 req.flash("success-message","your comment was submitted for review");
                 res.redirect(`/post/${post._id}`);
             })
        });
        })
         .catch(e => console.error(e))
        }
        else{
            req.flash("error-message","you need to login first to create a comment");
            res.redirect("/login");
        }
    }

}