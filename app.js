const express     = require("express"),
      app         = express(),
      bodyParser  = require("body-parser"),
      mongoose    = require("mongoose"),
	  flash       = require("connect-flash"),
      passport    = require("passport"),
      localStrategy = require("passport-local"),
      methodOverride = require("method-override"),
      Course      = require("./models/course"),
      Comment     = require("./models/comment"),
      User        = require("./models/user");
      // seedDB      = require("./seeds");
    
//requiring routes
const commentRoutes    = require("./routes/comments"),
    coursesRoutes     = require("./routes/courses"),
    indexRoutes      = require("./routes/index");

// mongoose.connect("mongodb://localhost/courses");    
mongoose.connect(process.env.DATABASEURL, {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log("Connected to DB!");
}).catch(err => {
	console.log("ERROR:", err.message);
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use('/fa', express.static(__dirname + '/node_modules/font-awesome/css'));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Texas State Bobcats!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/courses", coursesRoutes);
app.use("/courses/:id/comments", commentRoutes);


app.listen(3000, function() { 
	console.log('Server is running!'); 
});