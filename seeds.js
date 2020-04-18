
var mongoose= require("mongoose");
var Campground= require("./models/campground");
var Comment= require("./models/comment")

// raw campground data
var data= [
        {
            name: "Cloud's Rest",
            image: "/image1.png",
        description: "Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of de Finibus Bonorum et Malorum (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, Lorem ipsum dolor sit amet.., comes from a line in section 1.10.32."
        },
        {
            name: "Desert Mesa",
            image: "/image2.png",
            description: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source."
        },
        {
            name: "Canyon Floor",
            image: "/image3.png",
            description: "It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
        },
        {
            name: "Riverside",
            image: "https://i.picsum.photos/id/686/300/300.jpg",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. "
        },
        {
            name: "Desert Ride",
            image: "https://i.picsum.photos/id/791/300/200.jpg",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. "
        }
]

// remove all data and add new Temporary Data
function seedDB(){
    Campground.remove({}, (err) => {
        if (err)
            console.log("error occured");

        else{
            Comment.remove({}, (err)=>{});
            console.log("cleared campground and comment DB");
            
            //add new campgrounds
            data.forEach(function (seed) {
                Campground.create(seed, (err, newCamp) => {
                    if (err)
                        console.log("error in adding to DB");

                    else {
                        console.log("added a campground")
                        // console.log(newCamp);

                        // add new comments
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