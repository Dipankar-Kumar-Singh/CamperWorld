const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { campgroundSchema } = require("../validationSchemas");
const { isLoggedIn , validateCampground } = require("../middleware");
const campgrounds = require('../controllers/campgrounds.js');

// EVERY THING IN HERE IS --> AFTER : "/campgrounds", / this file paths

router.get("/", campgrounds.index);

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

// VALIDATE CAMPGROUND --> WORKS AS Middleware ..
// note : we don't need to call validateCampground anywhere inside ... it will be automatically called .
router.post("/", isLoggedIn, validateCampground, campgrounds.createCampground);

router.get("/:id", campgrounds.showCampground);

router.get("/:id/edit", isLoggedIn, campgrounds.renderEditForm);

// Happing using 🔥Mehtod Oveeride🔥 --> Normamly --> FROM --> GET / POST only two types allowed .
router.put("/:id", isLoggedIn, validateCampground, campgrounds.updateCampground);

router.delete("/:id", isLoggedIn, campgrounds.deleteCampground);

module.exports = router;
