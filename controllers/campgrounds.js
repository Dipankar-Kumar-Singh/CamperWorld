const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");



module.exports.index = catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
});


module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new");
}

module.exports.createCampground = catchAsync(async (req, res) => {
    // POSTING IT ... [ Adding new Campground ..]
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash("success", "successfully made a new campground");
    res.redirect(`/campgrounds/${campground._id}`);
});

module.exports.showCampground = catchAsync(async (req, res) => {
    // can't directly accesss id ... [ NO ]  // so use .. Request.params.id ;
    const campground = await Campground.findById(req.params.id).populate("reviews");
    // which properity to populate . --> reviews [ array ]
    if (!campground) {
        req.flash("error", "could not find campground");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
})


module.exports.renderEditForm = catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    console.log('campgoud is ', campground);
    if (!campground) {

        req.flash("error", "could not find campground");
        return res.redirect("/campgrounds");
    }

    res.render("campgrounds/edit", { campground });
})

module.exports.updateCampground = catchAsync(async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground,
    });
    req.flash("success", "successfully updated the campground");
    res.redirect(`/campgrounds/${campground._id}`);
})

module.exports.deleteCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "successfully deleted the campground");
    res.redirect("/campgrounds");
})