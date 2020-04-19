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
            console.log("error finding all camps from DB "+err);

        else {
            console.log("find all camps successfull")
            res.render("./campgrounds/index", { campgrounds: campgrounds });
        }
    });
});

// show new camp adding page
router.get("/new", isLoggedIn, (req, res) => {
    res.render("./campgrounds/new");
});

// handle new camp adding logic
router.post("/", isLoggedIn, (req, res) => {
    var name= req.body.campground.name;
    var image= req.body.campground.image;
    var desc= req.body.campground.description;
    var author= {
        id: req.user._id,
        username: req.user.username
    }

    Campground.create({name: name, image: image, description: desc, author: author}, (err, newCamp) => {
        if (err)
            console.log("error in adding camp to DB "+err);

        else {
            console.log("added " + newCamp.name + " to DB");
            console.log(newCamp);
        }
    });

    res.redirect("/campgrounds");
});

// show route
router.get("/:id", (req, res) => {                                        // note campgrounds/new matches also to :id 
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {     // hence must be defined above
        if (err) {
            console.log("error finding "+req.params.id+" from DB "+err)
        }

        else {
            console.log(foundCampground);
            res.render("./campgrounds/show", { campground: foundCampground });
        }
    });

});

// render edit campground page
router.get("/:id/edit", (req, res)=>{
    Campground.findById(req.params.id, (err, foundCampground)=>{
        if(err)
            console.log("error in finding camp "+err);
            
        else{
            console.log("found "+foundCampground);
            res.render("./campgrounds/edit", {campground: foundCampground});
        }
    });
});

// handle edit campground logic
router.put("/:id", (req, res)=>{
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCamp)=>{
        if(err){
            console.log("error in updating camp " + err);
            res.redirect("/campgrounds");
        }

        else{
            console.log("updated camp successfull");;
            console.log(updatedCamp);
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

// delete campground logic
router.delete("/:id", (req, res)=>{
    Campground.findByIdAndRemove(req.params.id, (err,)=>{
        if(err)
            console.log("error in deleting camp "+err);
             
        res.redirect("/campgrounds");
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