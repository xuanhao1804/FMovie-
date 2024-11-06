const Account = require("../models").account;
const { validationResult } = require('express-validator');
const { createJWT } = require('../middlewares/JsonWebToken')
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const OPT = require('../models').otp;
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, userId } = req.body;

    // Thêm log để kiểm tra userId
    console.log('User ID received:', userId);

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is missing' });
    }

    const account = await Account.findById(userId);
    if (!account) {
      console.log('Account not found');
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    if (account.password !== currentPassword) {
      console.log('Current password is incorrect');
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    account.password = newPassword;
    await account.save();

    console.log('Password changed successfully');
    return res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ success: false, message: 'Failed to change password', error: error.message });
  }
};


const signUp = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, fullname, dob, phone, roles } = req.body;

    // Không băm mật khẩu, lưu trực tiếp vào database
    const account = new Account({
      email,
      password,
      fullname,
      dob,
      phone,
      roles,
    });

    await account.save();
    res.status(201).send(account);
  } catch (error) {
    console.error('Error during sign-up:', error);
    res.status(500).send({ message: 'Failed to create account', error: error.message });
  }
};



const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const account = await Account.findOne({ email });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Kiểm tra mật khẩu theo cách đơn giản (không băm)
    if (account.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    return res.status(200).json({ account, token: createJWT({ email: account.email }) });
  } catch (error) {
    console.error('Error during sign-in:', error);
    return res.status(500).json({ message: 'An internal server error occurred', error: error.message });
  }
};



const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tattupro2705@gmail.com',
    pass: 'gshh oymp mbbf ywxc'
  }
});

const sendMail = async (req, res) => {
  try {
    const { email } = req.body;
    const account = await Account.findOne({ email });
    console.log(email);
    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }
    // Tạo mã OTP ngẫu nhiên 6 số
    const OTPCode = Math.floor(1000 + Math.random() * 9000);

    const mailOptions = {
      from: 'tattupro2705@gmail.com',
      to: email,
      subject: 'Reset password',
      priority: 'high',
      headers: {
        'List-Unsubscribe': `<mailto:${process.env.EMAIL_USER}?subject=unsubscribe>`,
        'Precedence': 'bulk',
        'X-Auto-Response-Suppress': 'OOF, AutoReply',
        'X-Report-Abuse': `Please report abuse here: tattupro2705@gmail.com`,
        'X-Mailer': 'FMovie Mailer System'
      },
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Reset Password</title>
</head>
<body>
<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Fmovie</a>
    </div>
    <p style="font-size:1.1em">Xin chào,</p>
    <p>Cảm ơn bạn đã sử dụng FMovie. Sử dụng mã OTP sau để hoàn tất quy trình khôi phục mật khẩu của bạn. Mã OTP có hiệu lực trong 5 phút.</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTPCode}</h2>
    <p style="font-size:0.9em;">Trân trọng,<br />FMovie Team</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>FMovie Inc</p>
      <p>166 Long Bien</p>
      <p>Ha Noi, Vietnam</p>
    </div>
  </div>
</div>
</body>
</html>`
    };

    // Gửi email
    const info = await transporter.sendMail(mailOptions);

    // Kiểm tra và lưu OTP vào database
    await OPT.findOneAndUpdate(
      { email: email }, // Điều kiện tìm kiếm
      { otp: OTPCode, timeCreated: new Date() }, // Giá trị cập nhật
      { upsert: true, new: true } // Nếu không tìm thấy thì tạo mới (upsert)
    );

    console.log('Email sent: ', info);
    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId,
      otp: OTPCode
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message
    });
  }
};

// Test connection khi khởi động server
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpData = await OPT.findOne({ email, otp });
    console.log(otpData, email, otp);
    if (!otpData) {
      return res.status(404).json({
        success: false,
        message: 'Invalid OTP code'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'OTP code is valid'
    });
  }
  catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP',
      error: error.message
    });
  }
}

const resetPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }
    const account = await Account.findOneAndUpdate(
      { email },
      { password },
      { new: true }
    );
    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  }
  catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password',
      error: error.message
    });
  }
}


const getAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await Account.findById(id);
    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }
    return res.status(200).json({ success: true, data: account });
  } catch (error) {
    console.error('Error fetching account:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch account', error: error.message });
  }
};

const updateAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body; // Nhận tất cả dữ liệu cần cập nhật từ req.body

    const account = await Account.findByIdAndUpdate(id, updatedData, { new: true });
    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }
    return res.status(200).json({ success: true, data: account, message: 'Account updated successfully' });
  } catch (error) {
    console.error('Error updating account:', error);
    res.status(500).json({ success: false, message: 'Failed to update account', error: error.message });
  }
};



const getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find(); // Lấy tất cả các tài khoản
    return res.status(200).json({ success: true, data: accounts });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch accounts', error: error.message });
  }
};



module.exports = {
  signUp,
  signIn,
  sendMail,
  verifyOTP,
  resetPassword,
  getAccount,
  updateAccount,
  getAllAccounts,
  changePassword
};