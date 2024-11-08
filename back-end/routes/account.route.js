const express = require("express");
const accountRoute = express.Router();
const { validateSignUp, validateSignIn, validateChangePassword } = require("../middlewares/validation");
const accountController = require("../controllers/account.controller");

accountRoute.post("/sign-up", validateSignUp, accountController.signUp);
accountRoute.post("/sign-in", validateSignIn, accountController.signIn);
accountRoute.post("/sign-in-google", accountController.loginWithGoogle)
accountRoute.post("/send-mail", accountController.sendMail);
accountRoute.post("/verify-otp", accountController.verifyOTP);
accountRoute.post("/reset-password", accountController.resetPassword);
accountRoute.get('/total-user', accountController.getTotalUser);
accountRoute.post('/update-account', accountController.updateAccountInfo);
accountRoute.post('/change-password', accountController.changePassword);
accountRoute.get('/:id', accountController.getAccount);
accountRoute.put('/:id', accountController.updateAccount);
accountRoute.get('/', accountController.getAllAccounts);

module.exports = accountRoute;