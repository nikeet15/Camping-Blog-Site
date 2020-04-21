var express = require("express");
var router = express.Router({mergeParams: true});                   // mergeParams is used to make :id(provided in prefix) function here 
                                                                    // and not behave as a constant, but rather a variable
// REQUIRE MODELS TO USED
var Campground = require("../models/campground")
var Comment = require("../models/comment");

// show new comment adding page
router.get("/new", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err)
            console.log("error in finding a camp- "+req.params.id+" "+err);

        else {
            console.log("found camp- " + foundCampground);
            console.log("rendering to new comments adding page");
            res.render("./comments/new", { campground: foundCampground });
        }
    })
});

// create new comment logic
router.post("/", isLoggedIn, (req, res) => {
    // create a new comment
    // find campground and push comment to it
    // redirect to campground show page

    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err)
            console.log("error in finding a camp- " + req.params.id + " " + err);

        else {
            console.log("found camp- " +foundCampground);
            Comment.create(req.body.comment, function (err, newComment) {
                if (err)
                    console.log("error in creating comment in "+foundCampground.name);

                else {
                    // add username and id to comment
                    newComment.author.id= req.user._id;
                    newComment.author.username= req.user.username;
                    newComment.save();

                    foundCampground.comments.push(newComment);
                    foundCampground.save();

                    console.log("added new comment- "+newComment);
                    res.redirect("/campgrounds/" + foundCampground._id);
                }
            });
        }
    });
});

// show editing comment page
router.get("/:comment_id/edit", (req, res)=>{
    Comment.findById(req.params.comment_id, (err, foundComment)=>{
        if(err)
        {
            console.log("error in finding comment from DB");
            res.redirect("back");
        }
            
        else
        {
            console.log("found comment from DB");
            res.render("./comments/edit", {comment: foundComment, campground_id: req.params.id});     
        }
    });
});

// update comment logic
router.put("/:comment_id", (req,res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            console.log("error in updating comment");
            res.redirect("back");
        }

        else{
            console.log("comment updated- "+req.body.comment);
            res.redirect("/campgrounds/" +req.params.id);
        }
    })
});

// delete comment logic
router.delete("/:comment_id", (req, res)=>{
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err){
            console.log("error in deleting comment " + err);
            res.redirect("back");
        }

        res.redirect("/campgrounds/" +req.params.id);
    })
});

//middleware
function isLoggedIn(req, res, next) {                                            // check user is Logged In or not middleware
    if (req.isAuthenticated())
        return next();

    else
        res.redirect("/login");
}

module.exports = router;