//jshint esversion:6
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

mongoose.connect("mongodb://localhost:27017/blogDB",{ useNewUrlParser: true, useUnifiedTopology: true  });

const postSchema = {
  title : String,
  content : String
}

const homeSchema = {
  posts : [postSchema]
}
const Post = mongoose.model("Post",postSchema);






const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
let postName= "";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req,res){
Post.find({},function(err,result){
  console.log(result);
  res.render("home", { startingContent: homeStartingContent , posts: result});
});



});


app.get("/about", function(req, res){

  res.render("about",{ aboutContent: aboutContent});

});

app.get("/contact", function(req,res){
  
  
  res.render("contact",{ contactContent : contactContent});
});

app.get("/compose", function(req,res){

  res.render("compose");
});

app.post("/compose",function(req,res){
 
 const webPost =new Post({
title: req.body.postTitle,
content: req.body.composedText

});
webPost.save();

setTimeout(res.redirect("/"),1000);

});



app.get("/posts/:postNumber", function(req,res){

const titleId = req.params.postNumber;
Post.findById({_id : titleId},function(err,result){
 
  res.render("post",{postTitle: result.title, postContent: result.content })
});
// posts.forEach(function(post){
// //   const postHeadingLower = _.lowerCase(post.title);
// //  const requestedTitleLower = _.lowerCase(requestedTitle);
  
// // if (requestedTitleLower === postHeadingLower){

// r

// // } else{
//   res.render("post",{ postTitle: "Sorry, Post Not found" ,postContent: ""});
// // }
});


app.get("/delete",function(req,res){

  Post.find({}, function(err,result){

    res.render("delete",{ posts : result })
  });
 
  
});

app.post("/delete",function(req,res){

const postId = req.body.delete;
Post.findOneAndDelete({_id : postId},function(err,result){
  if(err){
    console.log(err);
  }
});
setTimeout(res.redirect("/"),500);

});


/***************************for fun *********************************/
function fullPost(){
  posts.forEach(function(whichPost){
    let url ="/posts/"+whichPost.title ;
    app.get(url, function(req,res){
       
      res.render("post",{postTitle : whichPost.title, postContent: whichPost.content });
  
    });
  });
};

app.listen(3000, function() {
  console.log("Server started on port 3000");
});


// truncator funcation

function stringTruncator(str,length,ending){
  if(length == null){
    length = 100;  //default length
  }
  if(ending == null){
    ending = "...";
  }

  return str.substring(0,length- ending.length) + ending;
}