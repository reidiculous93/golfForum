var express = require("express");
var router  = express.Router();
var Course = require("../models/course");
var middleware = require("../middleware");


//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Course.find({}, function(err, allCourses){
       if(err){
           console.log(err);
       } else {
          res.render("courses/index",{courses:allCourses});
       }
    });
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
	var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCourse = {name: name, price: price, image: image, description: desc, author:author}
    // Create a new campground and save to DB
    Course.create(newCourse, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/courses");
        }
    });
});

//NEW - show form to create new course
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("courses/new"); 
});

// SHOW - shows more info about one course
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Course.findById(req.params.id).populate("comments").exec(function(err, foundCourse){
        if(err){
            console.log(err);
        } else {
            console.log(foundCourse)
            //render show template with that campground
            res.render("courses/show", {course: foundCourse});
        }
    });
});

// EDIT COURSE ROUTE
router.get("/:id/edit", middleware.checkCourseOwnership, function(req, res){
    Course.findById(req.params.id, function(err, foundCourse){
        res.render("courses/edit", {course: foundCourse});
    });
});

// UPDATE COURSE ROUTE
router.put("/:id",middleware.checkCourseOwnership, function(req, res){
    // find and update the correct campground
    Course.findByIdAndUpdate(req.params.id, req.body.course, function(err, updatedCourse){
       if(err){
           res.redirect("/courses");
       } else {
           //redirect somewhere(show page)
           res.redirect("/courses/" + req.params.id);
       }
    });
});

// DESTROY COURSE ROUTE
router.delete("/:id",middleware.checkCourseOwnership, function(req, res){
   Course.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/courses");
      } else {
          res.redirect("/courses");
      }
   });
});


module.exports = router;