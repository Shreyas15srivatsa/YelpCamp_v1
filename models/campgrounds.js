var mongoose = require("mongoose");

// Setup Mongoose Schema
var campgroundSchema = new mongoose.Schema({
	name : String,
	image: String,
	imageId: String,
	description : String,
	price: String,
	createdAt: {type:Date, default: Date.now},
	comments :[
		{
			type :mongoose.Schema.Types.ObjectID,
		 	ref: "Comment"
		}
		
	],
	user:{
		id: {
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username: String
	}
});

// Compile the model
module.exports = mongoose.model("Campground",campgroundSchema);