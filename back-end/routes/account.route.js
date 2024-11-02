const express = require("express");
const accountRoute = express.Router();
const { validateSignUp, validateSignIn } = require("../middlewares/validation");
const accountController = require("../controllers/account.controller");

accountRoute.post("/sign-up", validateSignUp, accountController.signUp)

accountRoute.post("/sign-in", validateSignIn, accountController.signIn)

accountRoute.post("/send-mail", accountController.sendMail)

accountRoute.post("/verify-otp", accountController.verifyOTP)

accountRoute.post("/reset-password", accountController.resetPassword)

accountRoute.get('/:id', accountController.getAccount);

accountRoute.put('/:id', accountController.updateAccount);

accountRoute.get('/', accountController.getAllAccounts);



module.exports = accountRoute;