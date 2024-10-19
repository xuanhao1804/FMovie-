const Account = require("../models").account;
const { validationResult } = require('express-validator');
const {createJWT} = require('../middlewares/JsonWebToken')

const signUp = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, fullname, dob, phone } = req.body;
    const account = new Account({
      email,
      password,
      fullname,
      dob,
      phone
    });

    await account.save();
    res.status(201).send(account);
  } catch (error) {
    res.status(500).send(error);
  }
};

const signIn = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const account = await Account.findOne({ email, password });
    if (!account) {
      return res.status(500).send('Account not found');
    }
    return res.status(200).send({account, token: createJWT({email: account.email})});
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  signUp,
  signIn
};