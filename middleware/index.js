var Comments = require('../models/comments');
var Campground = require('../models/campgrounds');

module.exports = {
  	isLoggedIn: function(req, res, next){
		  if(req.isAuthenticated()){
			return next();
		}
		req.flash("error", "Please login first.");
		res.redirect("/login");
	},
	checkOwnership: function(req,res,next){
		
		// Check if logged in 
		if(req.isAuthenticated()){

			Campground.findById(req.params.id, function(err,foundCampground){
				if(err){
					req.flash("error", "Campground not found.");
					res.redirect("back");
				}else{
					if(foundCampground.user.id.equals(req.user._id)){
						next();
					} else{
						req.flash("error", "Permission denied.");
						res.redirect("back");
					}

				}
			});

		}else{
			req.flash("error", "You need to be logged in.");
			res.redirect("back");
		}
	},
	checkCommentOwnership: function(req,res,next){
		
		// Check if logged in 
		if(req.isAuthenticated()){

			Comments.findById(req.params.comment_id, function(err,foundComment){
				if(err){
					res.redirect("back");
				}else{
					if(foundComment.author.id.equals(req.user._id)){
						next();
					} else{
						req.flash("error", "Permission denied.");
						res.redirect("back");
					}
				}
			});
		}else{
			req.flash("error", "You need to be logged in.");
			res.redirect("back");
		}
		
	}
}