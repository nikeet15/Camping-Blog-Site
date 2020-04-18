var express = require("express");
var router = express.Router();                                                  // router.get OR router.post is used in case routes defined 
                                                                                // in a seperate file and is exported to main file
// REQUIRE MODELS TO BE USED HERE
var Campground = require("../models/campground")

// CAMPGROUND ROUTES
// index route
router.get("/", (req, res) => {
    // console.log(req.user);                                                   // username and id is provided by passport

    Campground.find({}, (err, campgrounds) => {

        if (err)
            console.log("error finding all camps from DB");

        else {
            console.log("find all camps successfull")
            res.render("./campgrounds/index", { campgrounds: campgrounds });
        }
    });
});

// show new camp adding page
router.get("/new", (req, res) => {
    res.render("./campgrounds/new");
});

// handle new camp adding logic
router.post("/", (req, res) => {
    Campground.create({
        name: req.body.campground.name,
        image: req.body.campground.image,
        description: req.body.campground.description

    }, (err, newCamp) => {
        if (err)
            console.log("error in adding to DB");

        else {
            console.log("added" + newCamp.name + "to DB");
            console.log(newCamp);
        }
    });

    res.redirect("/campgrounds");
});

// show route
router.get("/:id", (req, res) => {                                        // note campgrounds/new matches also to :id 
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {     // hence must be defined above
        if (err) {
            console.log("error finding camp from DB")
        }

        else {
            console.log(foundCampground);
            res.render("./campgrounds/show", { campground: foundCampground });
        }
    });

});

module.exports = router;