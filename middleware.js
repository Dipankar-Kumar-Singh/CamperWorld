const { campgroundSchema, reviewSchema } = require("./validationSchemas");

const isLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl ;
        req.flash('error', 'Please Login First');
        res.redirect('/login') ;
    }   
    return next();
}

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

const validateReview = (req , res , next) => {
    
    const { error } = reviewSchema.validate(req.body) ;
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else next();
}


module.exports.isLoggedIn = isLoggedIn ;
module.exports.validateCampground = isLoggedIn ;
module.exports.validateReview = validateReview ;