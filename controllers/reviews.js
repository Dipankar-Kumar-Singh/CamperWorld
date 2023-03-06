const Campground = require("../models/campground");
const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync");


module.exports.createReview = catchAsync(async (req, res) => {
    // adding new review 
    const { id } = req.params;
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);

    campground.reviews.push(review);
    await review.save();
    await campground.save();

    req.flash('success', 'review successfully added ');
    res.redirect(`/campgrounds/${campground._id}`);

})


module.exports.deleteReview = catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);

    req.flash('success', 'review successfully deleted ');
    res.redirect(`/campgrounds/${id}`);

})

