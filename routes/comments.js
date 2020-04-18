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
            console.log("error in finding a camp");

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
            console.log("error in finding a camp");

        else {
            console.log("found camp- ", foundCampground);
            Comment.create(req.body.comment, function (err, newComment) {
                if (err)
                    console.log("error in creating comment");

                else {
                    foundCampground.comments.push(newComment);
                    foundCampground.save();
                    res.redirect("/campgrounds/" + foundCampground._id);
                }
            });
        }
    });
});

//middleware
function isLoggedIn(req, res, next) {                                            // check user is Logged In or not middleware
    if (req.isAuthenticated())
        return next();

    else
        res.redirect("/login");
}

module.exports = router;