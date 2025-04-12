const express = require("express");
const {
  handleUserRegistration,
  handleUserLogin,
  handleUserForgetPassword,
  handleUserForgetPasswordRequest,
  handleGoogleAuthCallBack,
  handleUserGoogleAuth,
} = require("../controllers/userAuth.controller");
const router = express.Router();
const passport = require("passport");

router.post("/register", handleUserRegistration);
router.post("/login", handleUserLogin);
router.post("/forgotPassword", handleUserForgetPassword);
router.post("/reset-password/:token", handleUserForgetPasswordRequest);

// Google Authentication Routes
router.get("/google", handleUserGoogleAuth);

// Google callback route after successful authentication
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  handleGoogleAuthCallBack
);

module.exports = router;
