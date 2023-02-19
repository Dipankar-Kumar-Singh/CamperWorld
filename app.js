const express = require("express");
const app = express();
const path = require("path");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Joi = require("joi");
const { campgroundSchema , reviewSchema } = require("./validationSchemas");
const Review = require("./models/review") ;
const Campground = require("./models/campground");

const campgrounds = require("./routes/campgrounds") ;

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
mongoose.set("strictQuery", false);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error : "));
db.once("open", () => {
    console.log("Database Conncected");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

/* -------------------------------------------------------------------------- */
/*                                  LEARNING                                  */
/* -------------------------------------------------------------------------- */

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


const validateReview = (req , res , next) => {
    
    const { error } = reviewSchema.validate(req.body) ;
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else next();
}

app.get("/", (req, res) => {
    res.render("home");
});

app.use('/campgrounds' , campgrounds) ;


app.post(
    "/campgrounds/:id/reviews",
    validateReview ,
    catchAsync(async (req, res) => { 
        
        const { id } = req.params ;
        const campground = await Campground.findById(req.params.id) ;
        const review = new Review(req.body.review) ;

        console.log(review) ;

        campground.reviews.push(review) ;
        await review.save() ;
        await campground.save() ;

        res.redirect(`/campgrounds/${campground._id}`) ;

    })
);

app.delete(
    "/campgrounds/:id/reviews/:reviewId" , 
    catchAsync( async (req , res ) => {
        const { id , reviewId } = req.params ;
        Campground.findByIdAndUpdate(id, {$pull : { reviews : reviewId}})
        await Review.findByIdAndDelete(reviewId) ; 
        
        res.redirect(`/campgrounds/${id}`) ;

    })
);


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
