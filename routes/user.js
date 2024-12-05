const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const { error } = require("console");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
//============controller section=====
const usersController = require("../controllers/users.js");

//============SIGN-UP===============
//Using Router.route
router
  .route("/signup")
  .get(usersController.signupGetUsers)
  .post(wrapAsync(usersController.signupPostUsers));

// router.get("/signup", usersController.signupGetUsers);

// router.post("/signup", wrapAsync(usersController.signupPostUsers));

//============LOGIN ROUTES===============

router.get("/login", usersController.loginUsersOne);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  usersController.loginUsersPost
);

//============LOGOUT ROUTES===============

router.get("/logout", usersController.logoutUsers);

module.exports = router;
