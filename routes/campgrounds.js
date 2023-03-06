const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { campgroundSchema } = require("../validationSchemas");
const { isLoggedIn, validateCampground } = require("../middleware");
const campgrounds = require('../controllers/campgrounds.js');

// EVERY THING IN HERE IS --> AFTER : "/campgrounds", / this file paths

router.route('/')
    .get(campgrounds.index)
    .post(isLoggedIn, validateCampground, campgrounds.createCampground);

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(campgrounds.showCampground) 
    .put( isLoggedIn, validateCampground, campgrounds.updateCampground)
    .delete(isLoggedIn, campgrounds.deleteCampground) ;

router.get("/:id/edit", isLoggedIn, campgrounds.renderEditForm);

module.exports = router;
