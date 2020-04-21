// all the middlewares here

var middlewareObj= {}                       // empty middleware object

// REQUIRE MODELS TO USED
var Campground = require("../models/campground")
var Comment = require("../models/comment");

// check authorization of user before edit/delete options
middlewareObj.checkCampOwner=  function(req, res, next) {                                        // check user is authenticated and owner of camp or not middleware
    if (req.isAuthenticated()) {                                                 // if yes redirect to next callback 
        Campground.findById(req.params.id, (err, foundCampground) => {           // else redirect to same page
            if (err) {
                console.log("error in finding camp " + err);
                res.redirect("back");                                            // ***IMP ("back") refers to same route
            }

            else {
                if (foundCampground.author.id.equals(req.user._id)) {            // NOTE---
                    console.log("found " + foundCampground);                     // req.user._id is a- string AND 
                    next();                                                      // foundCampground.author.id is an- object
                }                                                                // hence "===" will not work either use "==" OR 
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

// check authorization of user before edit/delete options
middlewareObj.checkCommentOwner= function(req, res, next) {                                     // check user is authenticated and owner of camp or not middleware
    if (req.isAuthenticated()) {                                                 // if yes redirect to next callback 
        Comment.findById(req.params.comment_id, (err, foundComment) => {         // else redirect to same page
            if (err) {
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

// check logged in or not
middlewareObj.isLoggedIn=  function(req, res, next) {                                            // check user is Logged In or not middleware
    if (req.isAuthenticated())
        return next();

    else
        res.redirect("/login");
}

module.exports= middlewareObj;