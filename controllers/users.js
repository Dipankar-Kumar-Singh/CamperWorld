const { User } = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");

module.exports.renderRegister = (req, res) => {
    res.render("users/register");
}

module.exports.userRegister = catchAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (e) => {
            if (e) return next(e);
            req.flash("success", "Successfully Registered ");
            res.redirect("/campgrounds");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
})


module.exports.renderLoginFrom = (req, res) => {
    res.render("users/login");
}

module.exports.login = (req, res) => {
    req.flash("success", "wlecome back");
    // will not work ... session is not persistnat 
    const redirectUrl = req.session.returnTo || '/campgrounds';
    console.dir(req.session) ;
    // console.dir(req.session) ;
    delete req.session.returnTo;
    res.redirect(redirectUrl);

}

module.exports.logout = async (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/campgrounds");
    });
}