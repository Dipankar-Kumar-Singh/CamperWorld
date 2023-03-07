const express = require("express");
const router = express.Router();
const passport = require("passport");
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegister)
    .post(users.userRegister);

router.route('/login')
    .get(users.renderLoginFrom)
    .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/login", }), users.login);

router.get("/logout", users.logout);

module.exports = router;
