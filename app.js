// Include required files.
var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	Campground = require("./models/campgrounds"),
	User = require("./models/user"),
	Comments = require("./models/comments"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	PassportLocalMongoose = require("passport-local-mongoose"),
	seedDB = require("./seeds.js"),
	methodOverride = require("method-override"),
	flash = require("connect-flash");

var campgroundRoutes = require("./routes/campgrounds"),
	commentRoutes = require("./routes/comments"),
	indexRoutes = require("./routes/index");

// require the .env file
require('dotenv').config();

console.log(process.env.DB_URL);

// Connect to mongodb.
mongoose.connect(process.env.DB_URL,{
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false
}).then(()=>{
	console.log("connected to db");
}).catch(err=>{
	console.log("ERROR:", err.message);
});

// Body parser config.
app.use(bodyParser.urlencoded({extended:true}));

// Default to .ejs
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));

app.use(methodOverride("_method"));

app.use(flash());

// Seed the mongoDB
//seedDB();

// Passport Config
app.use(require("cookie-session")({
	secret: "This is a secret",
	resave:false,
	saveUninitialized:false
	
}));

app.locals.moment = require('moment');

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
	
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);

const port = process.env.NODE_ENV === 'DEV' ? '3000' : process.env.PORT;
app.listen(port,function(){
	console.log("YelpCamp has started on port 3000")
});