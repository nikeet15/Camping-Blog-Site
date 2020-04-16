
var mongoose= require("mongoose");
var Campground= require("./models/campground");
var Comment= require("./models/comment")

// raw campground data
var data= [
        {
            name: "Cloud's Rest",
            image: "/image1.png",
            description: "jhbukjnancjkanc"
        },
        {
            name: "Desert Mesa",
            image: "/image2.png",
            description: "fgewigukwkk"
        },
        {
            name: "Canyon Floor",
            image: "/image3.png",
            description: "nukhniklnvem"
        }
]

// remove all campgrounds
function seedDB(){
    Campground.remove({}, (err) => {
        if (err)
            console.log("error occured");

        else{
            console.log("cleared DB");
            
            // add new campgrounds
            data.forEach(function (seed) {
                Campground.create(seed, (err, newCamp) => {
                    if (err)
                        console.log("error in adding to DB");

                    else {
                        console.log("added a campground")
                        // console.log(newCamp);

                        // add comments
                        Comment.create({
                            text: "just a test comment",
                            author: "nikeet"
                        }, function(err, newComment){
                               if(err)
                                console.log("error in creating comment");

                                else{
                                    newCamp.comments.push(newComment);
                                    newCamp.save();
                                    console.log("successfully pushed comments")
                                }
                        });
                    }
                })
            });
        }
    });
}

module.exports= seedDB;