const express = require("express");
const { User } = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const router = express.Router();
const passport = require("passport");

router.get("/register", (req, res) => {
    res.render("users/register");
});

router.post(
    "/register",
    catchAsync(async (req, res, next) => {
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
);

router.get("/login", (req, res) => {
    res.render("users/login");
});

// PASSPORT MAGIC
router.post(
    "/login",
    passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/login",
    }),
    (req, res) => {
        req.flash("success", "wlecome back");
        // will not work ... session is not persistnat 
        const redirectUrl = req.session.returnTo || '/campgrounds' ;
        delete req.session.returnTo ;
        //////////////////////////////////////////////
        res.redirect(redirectUrl);

    }
);

router.get("/logout", async (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/campgrounds");
    });
});

module.exports = router;
