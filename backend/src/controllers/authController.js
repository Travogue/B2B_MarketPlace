const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { generateToken, generateResetToken, generateVerifyToken } = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const { createSlug } = require('../utils/slugify');
const Notification = require('../models/Notification');

const sendTokenResponse = (user, statusCode, res, message) => {
  const token = generateToken(user._id);
  const options = {
    expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json(new ApiResponse(statusCode, { user, token }, message));
};

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'buyer', phone } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(400, 'Email already registered');

  const user = await User.create({ name, email, password, role, phone });

  if (role === 'seller') {
    const company = await Company.create({
      owner: user._id,
      companyName: `${name}'s Company`,
      slug: createSlug(`${name}-company-${Date.now()}`),
      contactEmail: email,
      contactPhone: phone,
    });
    user.company = company._id;
    await user.save();
  }

  const verifyToken = generateVerifyToken(user._id);
  user.emailVerifyToken = crypto.createHash('sha256').update(verifyToken).digest('hex');
  user.emailVerifyExpire = Date.now() + 24 * 60 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Verify Your Email - B2B Marketplace Portal',
      html: `<p>Hi ${user.name},</p><p>Please verify your email: <a href="${verifyUrl}">Verify Email</a></p>`,
    });
  } catch {
    console.log('Email send failed during registration');
  }

  sendTokenResponse(user, 201, res, 'Registration successful. Please verify your email.');
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password').populate('company');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res, 'Login successful');
});

exports.logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', { expires: new Date(Date.now()), httpOnly: true });
  res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
});

exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('company').populate('wishlist');
  res.status(200).json(new ApiResponse(200, user));
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) throw new ApiError(404, 'No user found with this email');

  const resetToken = generateResetToken(user._id);
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await sendEmail({
    email: user.email,
    subject: 'Password Reset - B2B Marketplace Portal',
    html: `<p>Reset your password: <a href="${resetUrl}">Reset Password</a></p><p>Link expires in 1 hour.</p>`,
  });

  res.status(200).json(new ApiResponse(200, null, 'Password reset email sent'));
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select('+password');

  if (!user) throw new ApiError(400, 'Invalid or expired reset token');

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res, 'Password reset successful');
});

exports.verifyEmail = asyncHandler(async (req, res) => {
  const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
  if (decoded.purpose !== 'verify') throw new ApiError(400, 'Invalid verification token');

  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    _id: decoded.id,
    emailVerifyToken: hashedToken,
    emailVerifyExpire: { $gt: Date.now() },
  });

  if (!user) throw new ApiError(400, 'Invalid or expired verification token');

  user.isEmailVerified = true;
  user.emailVerifyToken = undefined;
  user.emailVerifyExpire = undefined;
  await user.save();

  res.status(200).json(new ApiResponse(200, null, 'Email verified successfully'));
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone },
    { new: true, runValidators: true }
  );
  res.status(200).json(new ApiResponse(200, user, 'Profile updated'));
});

exports.updatePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(req.body.currentPassword))) {
    throw new ApiError(401, 'Current password is incorrect');
  }
  user.password = req.body.newPassword;
  await user.save();
  sendTokenResponse(user, 200, res, 'Password updated');
});
