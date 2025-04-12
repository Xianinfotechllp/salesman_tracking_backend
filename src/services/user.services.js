const userModel = require("../models/users");

const getAllUsers = async () => {
  return await userModel.find();
};

const getUserById = async (id) => {
  return await userModel.findById(id);
};

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
  

module.exports = {
  getAllUsers,
  getUserById,
  registerUser
};
