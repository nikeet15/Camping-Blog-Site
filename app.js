//Ctrl+j to toggle terminal

//APP CONFIG............
var express = require("express");                                               // express() return an object 
var mongoose = require("mongoose");
var bodyparser = require("body-parser");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Campground = require("./models/campground")
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

var app = express();
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(__dirname+ "/public"));                                  //making public a static directory
app.set("view engine", "ejs");                                                  //if written no need to write .ejs only write name of file

//MONGOOSE CONFIGURATION
mongoose.connect('mongodb://localhost:27017/Camps', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, function (err) {
    if (!err)
        console.log("Database connection successfull");

    else
        console.log("error in DB cnnection" + err);
});

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "this is a good project",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));                           // authentication strategy provided by passport JS
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// MIDDLEWARE RUNNERS
seedDB();
app.use(userPasser);

// CAMPGROUND ROUTES
app.get("/", (req, res)=>{
    res.render("landing");
});

app.get("/campgrounds", (req,res)=>{
    // console.log(req.user);                                                   // username and id is provided by passport
    
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

app.get("/campgrounds/:id", (req,res)=>{                                        // note campgrounds/new matches also to :id 
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

// COMMENT ROUTES
app.get("/campgrounds/:id/comments/new", isLoggedIn, (req,res)=>{
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

app.post("/campgrounds/:id/comments", isLoggedIn, (req,res)=>{
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

// AUTHENTICATION ROUTES
app.get("/register", (req, res)=>{
    res.render("register");
});

app.post("/register", (req, res)=>{                                            // passport register used converts password into hash
    var newUser= new User({username: req.body.username});                      // and passport predefined free authentication
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log("error in adding new user:"+err);
            return res.render("register");
        }

        else{
            console.log("adding user to DB succesfull");
            
            passport.authenticate("local")(req, res, function(){
                res.redirect("/campgrounds");
            });
        }
    });
});

app.get("/login", (req, res)=>{
    res.render("login");
});

app.post("/login", passport.authenticate("local",                               // passport free authentication procedure
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), (req,res)=>{
            console.log("login successsfull");
        
});

app.get("/logout", (req, res)=>{
    req.logout();
    res.redirect("/campgrounds");
})

// MIDDLEWARES
function isLoggedIn(req, res, next){                                            // check user is Logged In or not middleware
    if(req.isAuthenticated())
        return next();

    else
        res.redirect("/login");
}

function userPasser(req, res, next) {                                           // middleware to run before each route hence defined first
    res.locals.currUser = req.user;                                             // function is to provide currUser to each rendering page
    next();                                                                     // calls next() then to go to matching route
}

// STARTING SERVER..............................
app.listen(3000, function () {
    console.log("Server started");
});
