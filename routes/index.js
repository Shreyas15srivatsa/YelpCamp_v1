var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");
var { isLoggedIn } = middleware;

// ------------------ ROUTES ----------------------------

// Landing page
router.get("/",function(req,res){
	res.render("landing")	
});

// Auth routes

router.get("/register", function(req,res){
	res.render("register", {page:"register"})
});

router.post("/register", function(req,res){
	User.register(new User({username: req.body.username}), req.body.password, function(err,user){
		if(err){
			return res.render("register", {"error": err.message});
		}else{
			passport.authenticate("local")(req,res,function(){
				req.flash("success", "Welcome to YelpCamp " + user.username + "!");
				res.redirect("/campgrounds");
			});
		}	
	});
});

router.get("/login", function(req,res){
	res.render("login", {page:"login"});
});

router.post("/login", passport.authenticate("local", {
	successRedirect:"/campgrounds",
	failureRedirect:"/login",
	failureFlash: true
}), function(req,res){
});

router.get("/logout", function(req,res){
	req.logout();
	req.flash("success", "Logged out.")
	res.redirect("/campgrounds");
});

module.exports = router;