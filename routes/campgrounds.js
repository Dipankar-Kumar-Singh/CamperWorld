const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { campgroundSchema } = require("../validationSchemas");
const campground = require("../models/campground");
const { isLoggedIn } = require("../middleware");

// EVERY THING IN HERE IS --> AFTER : "/campgrounds", / this file paths

const validateCampground = (req, res, next) => {
  // SERVER SIDE VALIDATION
  // campgroundSchema is comming from validation Schema.js
  const result = campgroundSchema.validate(req.body);
  const { error } = result;
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else next();
  // very very IMP  : TO CALL NEXT() .. if this is going to be used as middleware
};

router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

// VALIDATE CAMPGROUND --> WORKS AS Middleware ..
// note : we don't need to call validateCampground anywhere inside ... it will be automatically called .
router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res) => {
    // POSTING IT ... [ Adding new Campground ..]
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash("success", "successfully made a new campground");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    // can't directly accesss id ... [ NO ]  // so use .. Request.params.id ;
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    // which properity to populate . --> reviews [ array ]
    console.log(campground);

    if (!campground) {
      req.flash("error", "could not find campground");
      return res.redirect("/campgrounds");
    }

    res.render("campgrounds/show", { campground });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    console.log('campgoud is ', campground);
    if (!campground) {

      req.flash("error", "could not find campground");
      return res.redirect("/campgrounds");
    }

    res.render("campgrounds/edit", { campground });
  })
);

// validateCampground --> Middleware .. it will run automatically to validate data at server side
// Happing using 🔥Mehtod Oveeride🔥 --> Normamly --> FROM --> GET / POST only two types allowed .
router.put(
  "/:id",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "successfully updated the campground");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// Happing using 🔥 Mehtod Oveeride🔥 --> Normamly --> FROM --> GET / POST only two types allowed .
router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "successfully deleted the campground");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
