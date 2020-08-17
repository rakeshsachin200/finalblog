module.exports = {
  
    selectOption : function (status, options) {
        
        return options.fn(this).replace(new RegExp('value=\"'+status+'\"'), '$&selected="selected"');
    },
    // this is determing whether file upload section is empty or not
   isEmpty: function (obj) {
        for(let key in obj) {
            if(obj.hasOwnProperty(key)) {
                return false;
            }
        }
        
        return true;
    },
    isUserAuthenticated:(req,res,next)=>{
        if (req.isAuthenticated()){
           next();
        }
        else{
            res.redirect("/login");
        }
    }
    
    
};