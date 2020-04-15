//Ctrl+j to toggle terminal

//APP CONFIG............
var express = require("express");
var app = express();                                // express() return an object 
var bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.static("public"));                  //making public a static directory
app.set("view engine", "ejs");                      //if written no need to write .ejs only write name of file

var camps = [
    { name: "Salmon Creek", image: "/image1.png" },
    { name: "Granite Mountain", image: "/image2.png" },
    { name: "Mountain's Rest", image: "/image3.png" },
    { name: "Salmon Creek", image: "/image1.png" },
    { name: "Granite Mountain", image: "/image2.png" },
    { name: "Mountain's Rest", image: "/image3.png" }
];

//ROUTES
app.get("/", (req, res)=>{
    res.render("landing");
});

app.get("/campgrounds", (req,res)=>{
    res.render("campgrounds", {camps: camps});
});

app.get("/campgrounds/new", (req, res)=>{
    res.render("new");
});

app.post("/campgrounds", (req,res)=>{
    var name= req.body.name;
    var image= req.body.image;
    var newcamp= {name: name, image: image};
    camps.push(newcamp);
    
    res.redirect("/campgrounds");
})

//starting server code..............................
app.listen(3000, function () {
    console.log("Server started");
});
