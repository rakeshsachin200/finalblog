// importing several packages 
const {globalVariables} = require('./config/configuration');
var express=require("express");
const PORT=1234;
var passport=require("passport");
var hbs =require("express-handlebars");
var Handlebars=require("handlebars");
var {mongoDbUrl}=require("./config/configuration");

var mongoose=require("mongoose");
mongoose.set('useNewUrlParser', true); 
mongoose.set('useUnifiedTopology', true);
mongoose.connect(mongoDbUrl);
var app=express();

var methodOverride=require("method-override");
var {selectOption}=require("./config/customFunctions");
var fileUpload=require("express-fileupload");
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
var flash=require("connect-flash");
var session=require("express-session");

var bodyParser=require("body-parser"); 
app.use(bodyParser.urlencoded({extended:true})); 
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));

// setting up handle-bars 

 



 //configuring the to use customfunctions


 app.engine('handlebars', hbs({defaultLayout: 'default', }));
app.set('view engine' , 'handlebars');

/*  Flash and Session*/
app.use(session({
   secret: 'anysecret',
   saveUninitialized: true,
   resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.engine('handlebars', hbs({
   handlebars: allowInsecurePrototypeAccess(Handlebars),helpers: { select: selectOption}
}));
 // need to define this to resolve handlebarrs denying issue

/* Method Override Middleware*/
app.use(methodOverride('newMethod'));
app.use(flash());
app.use(globalVariables);
app.use(fileUpload());






 // routes 
 var defaultroutes=require("./routes/defaultroutes");
 const adminRoutes = require('./routes/adminRoutes');

app.use('/', defaultroutes);
app.use('/admin', adminRoutes);



 




    
   

  















 app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
   });