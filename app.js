const express = require("express");
const app = express();
const path = require("path");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError") ;
const mongoose = require('mongoose');
const Campground = require("./models/campground");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const Joi = require("joi");
const { campgroundSchema } = require("./validationSchemas");

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
mongoose.set('strictQuery', false);

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error : "));
db.once('open', () => {
    console.log("Database Conncected");
});

app.engine("ejs", ejsMate);
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


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


const validateCampground = (req, res, next) => {
    // SERVER SIDE VALIDATION 
    // campgroundSchema is comming from validation Schema.js 
    const result = campgroundSchema.validate(req.body);
    const { error } = result;
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    }
    else next() ; 
    // very very IMP  : TO CALL NEXT() .. if this is going to be used as middleware 
}

app.get("/", (req, res) => {
    res.render("home");
})

app.get("/makecampground", catchAsync(async (req, res) => {
    // res.render("home") ;
    const camp = new Campground({
        title: "My Backyard",
        description: "Cheap Camping"
    });

    await camp.save();
    res.send(camp);
}));


app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });

}));

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});

// VALIDATE CAMPGROUND --> WORKS AS Middleware .. 
// note : we don't need to call validateCampground anywhere inside ... it will be automatically called .
app.post("/campgrounds", validateCampground ,catchAsync(async (req, res) => {

    // POSTING IT ... [ Adding new Campground ..]
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));


app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    // can't directly accesss id ... [ NO ]
    // so use .. Request.params.id ; 
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
}));


app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
    // res.send("Kuch toh mila ") ;
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
}))


// validateCampground --> Middleware .. it will run automatically to validate data at server side 
// Happing using 🔥Mehtod Oveeride🔥 --> Normamly --> FROM --> GET / POST only two types allowed . 
app.put("/campgrounds/:id" , validateCampground , catchAsync(async (req, res) => {
    const id = req.params.id;

    // console.log(id);  // ✅ Data Comming .. 
    // console.log(req.body.campground) ; // ✅ Data Comming .. 

    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });

    // Mistake : $ usee karna tha .. and I was using % ... 
    res.redirect(`/campgrounds/${campground._id}`);
}))

// Happing using 🔥 Mehtod Oveeride🔥 --> Normamly --> FROM --> GET / POST only two types allowed . 
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))


app.all("*" , (req , res , next ) => {
    // passing this New Error to Next .. 
    // ab agey jaha use hona hoga ess error ka [ depends on us .. we will use it ]
    next(new ExpressError("Page not found" , 404 )) ;

})

// CUSTOM ERROR HANDLER >>

app.use((error , req , res , next) => {
    const { statusCode = 500  , message = "Something went wrong" } = error ;

    // Because we are passing the error objdct in the render page .. 
    // thus default message may not be there . 

    if(!message) error.message = "SOMETHIG WENT WRONG !!!! " ;

    res.status(statusCode) ;
    res.render("error", { error }); // this error is not message .. it's EJS path ... f
    // res.send(message) ;
})

app.listen(3000, () => {
    console.log("Server is Running on PORT 3000");
})