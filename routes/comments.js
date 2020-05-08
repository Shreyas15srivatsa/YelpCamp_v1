var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campgrounds"),
	Comments = require("../models/comments");
var middleware = require("../middleware");
var { isLoggedIn, checkCommentOwnership } = middleware;


// ------------------ COMMENTS ROUTES ----------------------

router.get("/new", isLoggedIn , function(req, res){
	Campground.findById(req.params.id, function(err,campground){
		if(err){
			console.log(err)
		}else{
			res.render("comments/new", {campground:campground})
		}
	});
});

router.post("/", isLoggedIn ,function(req,res){
	Campground.findById(req.params.id, function(err,campground){
		if(err){
			req.flash("error", "Something went wrong...");
			res.redirect("/campgrounds")
		}else{
			// Create a new comment
			Comments.create(req.body.comment, function(err,createdComment){
				if(err){
					console.log(err)
				}else{
					createdComment.author.id = req.user._id;
					createdComment.author.username = req.user.username;
					createdComment.save();
					campground.comments.push(createdComment)
					campground.save();
					req.flash("success", "Successfully added review!");
					res.redirect("/campgrounds/" + campground._id)
				}
			});
		}
	});	
});

// Edit route 
router.get("/:comment_id/edit", checkCommentOwnership, function(req,res){
	Comments.findById(req.params.comment_id, function(err,foundComment){
		if(err){
			res.redirect("back");
		}else{
			res.render("comments/edit", {campground_id:req.params.id, comment:foundComment})
		}
	});

});

// Update route 
router.put("/:comment_id", checkCommentOwnership, function(req,res){
	Comments.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,updatedComment){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// Destroy route
router.delete("/:comment_id", checkCommentOwnership, function(req,res){
	Comments.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success", "Deleted review.");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

module.exports = router;