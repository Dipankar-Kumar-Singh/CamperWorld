const express = require("express");
const router = express.Router({ mergeParams: true });

const ExpressError = require("../utils/ExpressError");
const { isLoggedIn, validateReview } = require("../middleware");
const reviews = require("../controllers/reviews");

router.post("/", validateReview, isLoggedIn, reviews.createReview);
router.delete("/:reviewId", isLoggedIn, reviews.deleteReview);
module.exports = router;