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
router.get("/:comment_id/edit", checkCommentOwner, (req, res)=>{
    Comment.findById(req.params.comment_id, (err, foundComment)=>{
            res.render("./comments/edit", {comment: foundComment, campground_id: req.params.id});     
    });
});

// update comment logic
router.put("/:comment_id", checkCommentOwner, (req,res)=>{
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
router.delete("/:comment_id", checkCommentOwner, (req, res)=>{
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

// check authorization of user before edit/delete options
function checkCommentOwner(req, res, next) {                                     // check user is authenticated and owner of camp or not middleware
    if (req.isAuthenticated()) {                                                 // if yes redirect to next callback 
        Comment.findById(req.params.comment_id, (err, foundComment) => {         // else redirect to same page
            if(err) {
                console.log("error in finding comment " + err);
                res.redirect("back");                                            // ***IMP ("back") refers to same route
            }

            else {
                if (foundComment.author.id.equals(req.user._id)) {              // NOTE---
                    console.log("found " + foundComment);                       // req.user._id is a- string AND 
                    next();                                                     // foundCampground.author.id is an- object
                }                                                               // hence "===" will not work either use "==" OR 
                                                                                // mongoose predefined function- .equals()
            else {
                    console.log("you do not have permission");
                    res.redirect("back");
                }
            }
        });
    }

    else {
        console.log("not logged in");
        res.redirect("back");
    }
}

module.exports = router;