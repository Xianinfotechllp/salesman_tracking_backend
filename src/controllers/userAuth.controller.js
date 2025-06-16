const userModel = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const passport = require("passport");
const session = require("express-session");

const SECRET_KEY = process.env.JWT_SECRET;

async function handleUserRegistration(req, res) {
  const { name, mobileNumber, email, password, accountProvider } = req.body;
  console.log(req.body);

  if (!name || !mobileNumber || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    const existingUser = await userModel.findOne({ name });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this username already exists!" });
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

    // ------------------------------
    // ✅ JWT Token Generation (Aligned with login)
    // ------------------------------
    const tokenPayload = {
      id: newUser._id,
      name: newUser.name,
    };

    const token = jwt.sign(tokenPayload, SECRET_KEY, { expiresIn: "8h" });

    // ------------------------------
    // ✅ Respond with user data and token
    // ------------------------------
    return res.status(201).json({
      message: "User successfully registered!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        mobileNumber: newUser.mobileNumber,
        accountProvider: newUser.accountProvider,
      },
      token,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error, please try again later." });
  }
}

async function handleUserLogin(req, res) {
  console.log("User login");
  try {
    const { name, mobileNumber, password } = req.body;

    let query = {};
    if (name) {
      query.name = name;
    }
    if (mobileNumber) {
      query.mobileNumber = mobileNumber;  
    }

    const existingUser = await userModel.findOne(query);

    if (!existingUser) {
      return res.status(400).json({ message: "User not found!" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password!" });
    }

    const token = jwt.sign(
      { id: existingUser._id, name: existingUser.name },
      SECRET_KEY,
      { expiresIn: "8h" }
    );

    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: existingUser._id,
        name: existingUser.name,
        mobileNumber: existingUser.mobileNumber,  // Ensure it's sending mobileNumber
        email: existingUser.email,
        role: "user",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
}


async function handleUserForgetPassword(req, res) {
  const { email } = req.body;

  try {
    console.log(email);

    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email doesn't exist" });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const resetLink = `${process.env.CLIENT_URL}/auth/user/reset-password/${token}`;

    const mailOptions = {
      from: "salestrackingapp@company.com",
      to: email,
      subject: "Password Reset",
      text: `Click on this link to change your password: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({
      message: `Password reset link sent successfully \n${resetLink}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

async function handleUserForgetPasswordRequest(req, res) {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).send({ message: "Please provide a password" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findOne({ email: decode.email });

    console.log("Decoded email:", decode.email);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    if (user.password) {
      const isSamePassword = await bcrypt.compare(password, user.password);
      if (isSamePassword) {
        return res.status(400).send({
          message: "New password cannot be the same as the old password",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await user.save();
    res.status(200).send({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong" });
  }
}

async function handleUserGoogleAuth(req, res, next) {
  console.log("Initiating Google OAuth process...");
  passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next
  );
}

async function handleGoogleAuthCallBack(req, res, next) {
  console.log("Google callback received");

  const user = req.user;
  console.log("User object after Google authentication:", user);

  if (!user) {
    console.log("User not found after Google authentication");
    return res.status(400).json({ message: "Google authentication failed" });
  }

  const token = jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  console.log("Generated JWT token:", token);

  return res.json({ token });
}

module.exports = {
  handleUserRegistration,
  handleUserLogin,
  handleUserForgetPassword,
  handleUserForgetPasswordRequest,
  handleUserGoogleAuth,
  handleGoogleAuthCallBack,
};
