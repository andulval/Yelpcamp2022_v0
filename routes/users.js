const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const { isLoggedIn, checkReturnUrl } = require("../middleware");
const users = require("../controllers/users");

router
  .route("/register")
  .get(users.renderRegister)
  .post(catchAsync(users.registerUser));

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    checkReturnUrl,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.loginUser
  );

router.get("/logout", isLoggedIn, users.logoutUser);

module.exports = router;
