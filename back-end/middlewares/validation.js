const { body } = require('express-validator');
const Account = require("../models").account;


const validateChangePassword = (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ success: false, message: 'New passwords do not match' });
  }
  next();
};

module.exports = {
  validateChangePassword,
  // other exports
};

// Validation middleware
const validateSignUp = [
    body('email')
      .isEmail().withMessage('Please enter a valid email')
      .custom(async (value) => {
        const existingAccount = await Account.findOne({ email: value });
        if (existingAccount) {
          throw new Error('Email already in use');
        }
      }),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long'),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match');
        }
        return true;
      }),
    body('fullname').notEmpty().withMessage('Full name is required'),
    body('phone')
      .matches(/^\d{10}$/).withMessage('Please enter a valid 10-digit phone number'),
    body('agreement')
      .isBoolean()
      .custom((value) => {
        if (!value) {
          throw new Error('You must agree to the terms of use');
        }
        return true;
      })
  ];

const validateSignIn = [
    body('email')
      .isEmail().withMessage('Please enter a valid email'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
  ];

module.exports = {
    validateSignUp,
    validateSignIn,
    validateChangePassword
};