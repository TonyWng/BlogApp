var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var app = express();
var methodOverride = require("method-override");


mongoose.connect("mongodb://localhost/blogApp");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static ('public'));
app.use(methodOverride("_method"));

// Mongoose/Model Config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model('Blog', blogSchema);

// Blog.create({
//     title: "Test Blog",
//     image: "https://cdn0.tnwcdn.com/wp-content/blogs.dir/1/files/2015/04/usertesting.jpg",
//     body: "This is a test blog post",
// })

// RESTful Routes

//Index Route
app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        } else {
            res.render("index.ejs", {blog: blogs});
        }
    })
});

//New Route
app.get("/blogs/new", function(req, res){
    res.render("new.ejs");
});

//Create Route
app.post("/blogs/new", function(req, res){
    console.log(req.body.blog);
    Blog.create(req.body.blog , function(err, newBlog){
        if(err){
            console.log("there is an error");
            console.log(err);
        } else {
            res.redirect("/blogs");
        };
    });
});

//Show Route
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err);
            res.redirect("/");
        } else {
            res.render("show.ejs", {blog: foundBlog});
        }
    });
});

//Edit Route
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err);
            res.redirect("/");
        } else {
            res.render("edit.ejs", {blog: foundBlog});
        }
    });
});

//Update Route
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    })
});

//Delete Route
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});




app.listen(3000, function(){
    console.log("Server is running");
});