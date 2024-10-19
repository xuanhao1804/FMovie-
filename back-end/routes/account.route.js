const express = require("express");
const accountRoute = express.Router();
const { validateSignUp, validateSignIn } = require("../middlewares/validation");
const accountController = require("../controllers/account.controller");

accountRoute.post("/sign-up", validateSignUp, accountController.signUp)

accountRoute.post("/sign-in", validateSignIn, accountController.signIn)

module.exports = accountRoute;