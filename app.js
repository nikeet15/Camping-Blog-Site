//Ctrl+j to toggle terminal

//APP CONFIG............
var express = require("express");                                // express() return an object 
var mongoose = require("mongoose");
var bodyparser = require("body-parser");
var Campground = require("./models/campground")
var Comment = require("./models/comment");
var seedDB= require("./seeds");

var app = express();
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(__dirname+ "/public"));                  //making public a static directory
app.set("view engine", "ejs");                      //if written no need to write .ejs only write name of file

mongoose.connect('mongodb://localhost:27017/Camps', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, function (err) {
    if (!err)
        console.log("Database connection successfull");

    else
        console.log("error in DB cnnection" + err);
});

seedDB();

//ROUTES
app.get("/", (req, res)=>{
    res.render("landing");
});

app.get("/campgrounds", (req,res)=>{
    Campground.find({}, (err, campgrounds)=>{

        if(err)
            console.log("error finding all camps from DB");

        else{
            console.log("find all camps successfull")
            res.render("./campgrounds/index", { campgrounds: campgrounds });
        }
    });
});

app.get("/campgrounds/new", (req, res)=>{
    res.render("./campgrounds/new");
});

app.post("/campgrounds", (req,res)=>{
    Campground.create({
        name: req.body.campground.name,
        image: req.body.campground.image,
        description: req.body.campground.description

    }, (err, newCamp)=>{
        if(err)
            console.log("error in adding to DB");
 
        else{
            console.log("added"+ newCamp.name+ "to DB");
            console.log(newCamp);
        }
    });
    
    res.redirect("/campgrounds");
});

app.get("/campgrounds/:id", (req,res)=>{                               // note campgrounds/new matches also to :id 
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){     // hence must be defined above
        if(err){
            console.log("error finding camp from DB")
        }

        else{
            console.log(foundCampground);
            res.render("./campgrounds/show", {campground: foundCampground});
        }
    });                           

});

// Coments routes
app.get("/campgrounds/:id/comments/new", (req,res)=>{
    Campground.findById(req.params.id, (err, foundCampground)=>{
        if(err)
            console.log("error in finding a camp");
        
        else{
            console.log("found camp- "+ foundCampground);
            console.log("rendering to new comments adding page");
            res.render("./comments/new", {campground: foundCampground});
        }
    })
});

app.post("/campgrounds/:id/comments", (req,res)=>{
    // create a new comment
    // find campground and push comment to it
    // redirect to campground show page

    Campground.findById(req.params.id, (err, foundCampground)=>{
        if(err)
            console.log("error in finding a camp");

        else{
            console.log("found camp- ", foundCampground);
            Comment.create(req.body.comment, function(err, newComment){
                if(err)
                    console.log("error in creating comment");

                else{
                    foundCampground.comments.push(newComment);
                    foundCampground.save();
                    res.redirect("/campgrounds/" +foundCampground._id);
                }
            });
        }
    });
});


//starting server code..............................
app.listen(3000, function () {
    console.log("Server started");
});
