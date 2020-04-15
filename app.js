//Ctrl+j to toggle terminal

//APP CONFIG............
var express = require("express");
var app = express();    
                             // express() return an object 
var bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.static("public"));                  //making public a static directory
app.set("view engine", "ejs");                      //if written no need to write .ejs only write name of file

//ROUTES
app.get("/", (req, res)=>{
    res.render("landing");
});

app.get("/campgrounds", (req,res)=>{
    var camps= [
        { name: "Salmon Creek", image: "/image1.png" },
        { name: "Salmon Creek", image: "/image2.png" },
        { name: "Salmon Creek", image: "/image3.png" },
    ]

    res.render("campgrounds", {camps: camps});
});


//starting server code..............................
app.listen(3000, function () {
    console.log("Server started");
});
