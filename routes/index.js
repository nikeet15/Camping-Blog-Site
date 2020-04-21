var express = require("express");
var router = express.Router();                                                   // router.get OR router.post is used in case routes defined 
var passport = require("passport");                                              // in a seperate file and is exported to main file

// REQUIRE MODELS
var User = require("../models/user")

// root route
router.get("/", (req, res) => {
    res.render("landing");
});

// AUTHENTICATION ROUTES
// show register form
router.get("/register", (req, res) => {
    res.render("register");
});

// handling sign up logic
router.post("/register", (req, res) => {                                          // passport register used converts password into hash
    var newUser = new User({ username: req.body.username });                      // and passport predefined free authentication
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            console.log("error in adding new user:" + err);
            return res.render("register");
        }

        else {
            console.log("adding user to DB succesfull");

            passport.authenticate("local")(req, res, function () {
                req.flash("success", "Welcome "+ user.username);
                res.redirect("/campgrounds");
            });
        }
    });
});

// show login form
router.get("/login", (req, res) => {
    res.render("login");
});

// handle login logic
router.post("/login", passport.authenticate("local",                               // passport free authentication procedure
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), (req, res) => {
        console.log("login successsfull");

});

// logout route
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "logged out successfully!")
    res.redirect("/campgrounds");
})

module.exports = router;