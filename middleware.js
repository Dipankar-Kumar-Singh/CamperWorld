const isLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl ;
        req.flash('error', 'Please Login First');
        res.redirect('/login') ;
    }   
    return next();
}

module.exports.isLoggedIn = isLoggedIn ;