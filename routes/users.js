const express = require("express");
const router = express.Router();
const passport = require("passport");
const users = require('../controllers/users');

router.get("/register", users.renderRegister);

router.post("/register", users.userRegister);

router.get("/login", users.renderLoginFrom);

// PASSPORT MAGIC
router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login", }), users.login);

router.get("/logout", users.logout);

module.exports = router;
