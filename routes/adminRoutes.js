var express=require("express");
var router=express.Router();
var adminController=require("../controller/adminController");
// this will tell the system to use admin layout
//===============
//this will let use the user authentication
const {isUserAuthenticated}=require("../config/customFunctions");
router.all('/*',isUserAuthenticated,(req, res, next) => {
    
    req.app.locals.layout = 'admin';
    
    next();
});

// ROOT route of admin
router.route("/")
.get(adminController.index);

router.route("/posts")
.get(adminController.getPosts);

// route for creatring posts 
router.route("/posts/create")
.get(adminController.createPost);
router.route("/posts/create")
.post(adminController.submitPosts);
module.exports=router;
// route for editing posts
router.route("/posts/edit/:id")
.get(adminController.editPostGetRoute);
router.route("/posts/edit/:id")
.put(adminController.editPostUpdateRoute);
// delete route for posts

router.route('/posts/delete/:id')
    .delete(adminController.deletePost);
 // Admin category routes
router.route('/category')
    .get(adminController.getCategories);
router.route('/category')
.post(adminController.createCategories);
// edit routes for category
router.route('/category/edit/:id')
    .get(adminController.editCategoriesGetRoute);
router.route('/category/edit/:id')
.post(adminController.editCategoriesPostRoute);
// logout for admin

// creating routes for comments
router.route("/comment")
.get(adminController.getcomments)
