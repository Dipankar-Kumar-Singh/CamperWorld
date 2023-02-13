const express = require("express") ;
const app = express() ;
const path = require("path") ;
const mongoose = require('mongoose');
const Campground = require("./models/campground");
const methodOverride = require('method-override') ;
const ejsMate = require("ejs-mate") ; 

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp' );
mongoose.set('strictQuery', false);

const db = mongoose.connection ;
db.on('error' , console.error.bind(console, "connection error : ")) ;
db.once('open' , () => {
    console.log("Database Conncected") ;
});

app.engine("ejs" , ejsMate) ;
app.set('view engine' , 'ejs') ;
app.set("views" , path.join(__dirname , 'views')) ;

app.use(express.urlencoded({extended : true })) ;
app.use(methodOverride('_method')) ;


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


app.get("/" , ( req , res) => {
    res.render("home") ;
})

app.get("/makecampground" , async ( req , res) => {
    // res.render("home") ;
    const camp = new Campground({
        title : "My Backyard" ,
        description : "Cheap Camping"
    }) ;

    await camp.save() ;
    res.send(camp) ;
});


app.get('/campgrounds' , async (req , res) => {
    const campgrounds = await Campground.find({}) ;
    res.render('campgrounds/index', { campgrounds }) ;

}) ;

app.get("/campgrounds/new" , (req , res ) => {
    res.render("campgrounds/new") ;
});

app.post("/campgrounds" , async ( req , res ) => {

    const campground = new Campground(req.body.campground) ;
    await campground.save() ;
    // console.log(req.body.campground) ;

    res.redirect(`/campgrounds/${campground._id}`) ;
})


app.get('/campgrounds/:id' , async( req , res ) => {
    // can't directly accesss id ... [ NO ]
    // so use .. Request.params.id ; 
    const campground = await Campground.findById(req.params.id) ;
    res.render('campgrounds/show' , { campground }) ;
});


app.get("/campgrounds/:id/edit", async (req, res) => {
    // res.send("Kuch toh mila ") ;
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
})


// Happing using 🔥Mehtod Oveeride🔥 --> Normamly --> FROM --> GET / POST only two types allowed . 
app.put("/campgrounds/:id" , async (req , res) => {
    const id = req.params.id ;

    // console.log(id);  // ✅ Data Comming .. 
    // console.log(req.body.campground) ; // ✅ Data Comming .. 

    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }) ;

    // Mistake : $ usee karna tha .. and I was using % ... 
    res.redirect(`/campgrounds/${campground._id}`) ;
})

// Happing using 🔥 Mehtod Oveeride🔥 --> Normamly --> FROM --> GET / POST only two types allowed . 
app.delete('/campgrounds/:id' , async (req , res) => {
    const { id } = req.params ;
    await Campground.findByIdAndDelete(id) ;
    res.redirect('/campgrounds') ;
})


app.listen(3000 , () => {
    console.log("Server is Running on PORT 3000");
})