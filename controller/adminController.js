const Post = require('../models/postmodel');
const Category =require ("../models/categoryModel");
const Comment   =require ("../models/CommentModel");
const {isEmpty}=require("../config/customFunctions");
module.exports={
    index:function(req,res){
        res.render("admin/index");
    },
    getPosts:function(req,res){
        // we will retrieve the post data from database and use it in our  index file 
        Post.find()
        .populate("category")
        .then(posts => {
            res.render('admin/post/index', {posts: posts});
        });
    },
    submitPosts:function(req,res){

        const commentsAllowed = req.body.allowComments ? true : false;
        //check for input file 
        let filename = '';
        
        if(!isEmpty(req.files)) {
            let file = req.files.uploadedFile;
            filename = file.name;
            let uploadDir = './public/uploads/';
            
            file.mv(uploadDir+filename, (err) => {
                if (err)
                    throw err;
            });
        }
        const newPost= new Post({
            // creating a new post in accordance with the post schema model
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            allowComments: commentsAllowed,
            category:req.body.category,
            snippet:req.body.snippet,
            file: `/uploads/${filename}`

         } );
         newPost.save().then(post => {
            req.flash('success-message', 'Post created successfully.');
            res.redirect('/admin/posts');
        });
    },
    createPost:function(req,res){

        Category.find().then(cats => {
            res.render('admin/post/create', {categories: cats});
        });
        
    },
    // editing post
    editPostGetRoute: (req, res) => {
        const id = req.params.id;

        Post.findById(id)
            .then(post => {
                Category.find().then(cats => {
                    res.render('admin/post/edit', {post: post, categories:cats});
                });
                
        
            });
          
    },
    // submitting the edit route
    editPostUpdateRoute: (req, res) => {
        const commentsAllowed = req.body.allowComments ? true : false;

       
        const id = req.params.id;

        Post.findById(id)
            .then(post => {

                post.title = req.body.title;
                post.status = req.body.status;
                post.allowComments = req.body.allowComments;
                post.description = req.body.description;
                post.category = req.body.category;


                post.save().then(updatePost => {
                    req.flash('success-message', `The Post ${updatePost.title} has been updated.`);
                    res.redirect('/admin/posts');

                });
            });

    },
    // delete posts
    deletePost: (req, res) => {

        Post.findByIdAndDelete(req.params.id)
            .then(deletedPost => {
                req.flash('success-message', `The post ${deletedPost.title} has been deleted.`);
                res.redirect('/admin/posts');
            });
    },
    // categories routes 
     /* ALL CATEGORY METHODS*/
     getCategories: (req, res) => {
          Category.find().then(cats => {
            res.render('admin/category/index', {categories: cats});
        });
    },
    // creatning new categories
    
    createCategories: (req, res) => {
        var categoryName = req.body.name;

        if (categoryName) {
            const newCategory = new Category({
                title: categoryName
            });

            newCategory.save().then(category => {
                res.status(200).json(category);
            });
        }

    },
    // editing categories get route
    editCategoriesGetRoute: async (req, res) => {
        const catId = req.params.id;

        const cats = await Category.find();


        Category.findById(catId).then(cat => {

            res.render('admin/category/edit', {category: cat, categories: cats});

        });
    },
    // editing categories post route
    editCategoriesPostRoute: (req, res) => {
        const catId = req.params.id;
        const newTitle = req.body.name;

        if (newTitle) {
            Category.findById(catId).then(category => {

                category.title = newTitle;

                category.save().then(updated => {
                    res.status(200).json({url: '/admin/category'});
                });

            });
        }
    },
    // commments section
    getcomments:(req,res)=>{
        Comment.find()
        .populate("user")
        .then(comments=>{
            res.render("admin/comment/index",{comments:comments});

        })

    }
}