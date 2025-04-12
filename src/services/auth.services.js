//Not implemented yet, auth logic is from auth.controller.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = "nodemailer";
const userModel = require("../models/users");
const ApiError = require("../utils/ApiError");

const SECRET_KEY = process.env.JWT_SECRET;

const registerUser = async (
  name,
  mobileNumber,
  email,
  password,
  accountProvider
) => {
  if (!name || mobileNumber || !password) {
    throw new ApiError(400, "All fields are required!");
  }

  const existingUser = await userModel.find({ name });

  if (existingUser) {
    throw new ApiError(400, "User with this name already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new userModel({
    name,
    email,
    mobileNumber,
    password: hashedPassword,
    accountProvider,
  });

  await newUser.save();
  return newUser
};
