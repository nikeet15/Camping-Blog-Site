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

// REQUIRE ROUTES DEFINED SEPERATELY...........
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

var app = express();
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));                                  //making public a static directory
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

// MIDDLEWARES
function userPasser(req, res, next) {                                           // middleware to run before each route hence defined first
    res.locals.currUser = req.user;                                             // function is to provide currUser to each rendering page
    next();                                                                     // calls next() then to go to matching route
}

// USE ROUTES DEFINED SEPERATELY
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);                            // providing prefixes here attaches it before corresponding route

// STARTING SERVER..............................
app.listen(3000, function () {
    console.log("Server started");
});
