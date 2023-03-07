const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");

const MY_ACCESS_TOKEN = 'pk.eyJ1IjoidGVhLWRldiIsImEiOiJjbGV4b2VxcmsybHl4M3VydjY3NWNhMjl3In0.fNaTP9mskssQg4uEbTBpYw';
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geoCoder = mbxGeocoding({ accessToken: MY_ACCESS_TOKEN });

// const mbxStyles = require('@mapbox/mapbox-sdk/services/styles');
// const stylesService = mbxStyles({ accessToken: MY_ACCESS_TOKEN });


module.exports.index = catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
});

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = catchAsync(async (req, res) => {
    // POSTING IT ... [ Adding new Campground ..]
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();

    const dataCoordinate = geoData.body.features[0].geometry.coordinates;
    // console.log(dataCoordinate);
    // console.log(geoData.body.features[0].geometry.coordinates);

    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    await campground.save();

    // console.log(campground);

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
    else
        res.render("campgrounds/show", { campground });
})


module.exports.renderEditForm = catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    // console.log('campgoud is ', campground);
    if (!campground) {

        req.flash("error", "could not find campground");
        return res.redirect("/campgrounds");
    }
    else res.render("campgrounds/edit", { campground });
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