const express = require("express");
const app = express();
const path = require("path");
const ExpressError = require("./utils/ExpressError");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const LocalSrategy = require("passport-local");
const passport = require("passport");


/* --------------------------------- ROUTES --------------------------------- */
const userRoutes = require("./routes/users");
const campgroundsRoutes = require("./routes/campgrounds");
const reviewsRoutes = require("./routes/reviews");

/* -------------------------------------------------------------------------- */
/*                                  DATABASE                                  */
/* -------------------------------------------------------------------------- */
const { User } = require("./models/user");

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
mongoose.set("strictQuery", false);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error : "));
db.once("open", () => {
    console.log("Database Conncected");
});
/* -------------------------------------------------------------------------- */

/* ------------------------------- VIEW ENGINE ------------------------------ */
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
/* -------------------------------------------------------------------------- */


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
    secret: "random-Key-dev-mode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        // httpOnly : true ,  : Now Default On ..
        expires: Date.now() + 1000 * 60 * 60,
        maxAge: 1000 * 60 * 60,
    },
};


/* -------------------------------------------------------------------------- */
/*                               Authentication                               */
/* -------------------------------------------------------------------------- */

// BE SURE TO USE >. app.use(session()) before passport
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalSrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* ----------------------------------FLASH-------------------------------- */

app.use(flash());
// it is better to use flash with customm middleware ...
/* ---------------------- GLOBAL DATA -> Across the app --------------------- */
app.use((req, res, next) => {

    res.locals.currentUser = req.user ; // res.user --> by passport 
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    // usually only one message is used .. message_obj = { succ : " " , fail : " " } ;
    next();
});

/* -------------------------------------------------------------------------- */
/*                     LEARNING AT LAST : SEE THE COMMENTS                    */
/* -------------------------------------------------------------------------- */

app.get("/", (req, res) => {
    res.render("home");
});

// IMPORTATN :: SPECIALLY [ REVIEWS ] ROUTS .. ID key sath bhi use kar saktey hai
app.use("/", userRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);
// BY DEFAULT >> EXPRESS ROUTE HANDLER >>> DON't Give this ID to reviews routes
// route file key andar --> no accesss of ID ...
// so .. go to reviews.js route file and add this line :
// const router = express.Router({mergeParams : true}) ;

app.all("*", (req, res, next) => {
    // passing this New Error to Next ..
    // ab agey jaha use hona hoga ess error ka [ depends on us .. we will use it ]
    next(new ExpressError("Page not found", 404));
});

// CUSTOM ERROR HANDLER >>

app.use((error, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = error;

    // Because we are passing the error objdct in the render page ..
    // thus default message may not be there .

    if (!message) error.message = "SOMETHIG WENT WRONG !!!! ";
    res.status(statusCode);
    res.render("error", { error }); // this error is not message .. it's EJS path ... f
    // res.send(message) ;
});

app.listen(3000, () => {
    console.log("Server is Running on PORT 3000");
});

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  / forget  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Note : Always get/post path start from '/' symball ..
//[ very common mistake to forget to add / before any path in get/post request ]

/* --------------------- Form Ka Data Kaisey Read karey --------------------- */
// to read form data from post request ..
// req.body is empty by default .. so use body parser ;
// use this line : app.use(express.urlencoded({extended : true })) ;

/* -------------------------------------------------------------------------- */
/*                  CONFUSING THINGS .. CLEARING SELF DOUBTS                  */
/* -------------------------------------------------------------------------- */
// What is ACTION in Form data .. ??? [ it's redirect page location ... not a phical pagee .. but a ROUTE ]
// ACTION is PATH ... where data will be send with GET / POST request ..
// GET/POST REQ are made up on the Route [ ACTION ] ..
// Method overRide can happen to the BASIC FORM NATURE ..

// WHAT ARE VALUES In HTML ... PRE-FILLED VALUE

// WHAT IS name = "campground[title]" ?
// more precise ... <input type="text"  id="title" name = "campground[title]" value="<%= campground.title %>">
// .. there can be many input boxes .. SABA DATA COMBINE KARKEY EK JS OBJECT bana saktey hai using objectName[property]
// name1 =  obj[title] , name2 = obj[price] , name3 = obj[location]
// at Last .. obj = { title : __ , price : __  , location : ___ } ==> this can be accessed by : req.body.objName
// example [ in PUT req below ] : req.body.campground  [ NOT DIRECTLY I THINK , BODY PARSER REQED]

// ERROR HANDLING :
// CathAsync is util file .. A JS PATTEN [ EXPRESS ERRROR HANDLING PATTERN ]
