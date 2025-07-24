import { User } from "../Model/userSchema.js";
import bcrypt from 'bcryptjs'; 
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Register User
export const RegisterUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    // const user = await User.findOne({ email });
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (user) {
      return res.json({
        message:
          "User is already exists either with same username or same email. Please try with a different username or email",
        success: false,
      });
    } else {
      const hashpassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
  username,
  email,
  password: hashpassword,
  role: role || "user", 
});

      return res.json({
        message: "user created successfull",
        newUser,
        success: true,
        role: role || "user",
      });
    }
  } catch (error) {
    return res.json({ message: error.message, success: false });
  }
};

// get all regiaster
export const getAllUser = async (req, res) => {
  try {
    const AllUser = await User.find();

    if (!AllUser || AllUser.length === 0) {
      return res.json({
        message: "No users found in database",
        success: false,
      });
    }
    return res.json({
      message: "All users fetched successfully",
      AllUser,
      success: true,
    });
  } catch (error) {
    return res.json({ message: error.message, success: false });
  }
};

//Login User

export const LoginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "User not found", success: false });
    }

    //Matching password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ message: "Invalid credentials", success: false });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "365d" }
    );

    return res.json({
      message: "Login successful",
      token,
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
    });
  } catch (error) {
    return res.json({ message: error.message, success: false });
  }
};

//get profile

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.json({ message: "User not found", success: false });
    }

    res.json({
      message: "User profile fetched successfully",
      user,
      success: true,
    });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

export const UpdateUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const id = req.params.id;

    const hashpassword = await bcrypt.hash(password, 10);
    const updatedData = { username, email, password: hashpassword, role };

    const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedUser) {
      return res.json({ message: "No user found to update", success: false });
    }

    return res.json({
      message: "User updated successfully",
      updatedUser,
      success: true,
    });
  } catch (error) {
    return res.json({ message: error.message, success: false });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteUser = await User.findByIdAndDelete(id);
    if (!deleteUser)
      return res.json({
        message: "No user find particuler this ID",
        success: false,
      });
    res.json({ message: "User Deleted Succesfully", success: true });
  } catch (error) {
    return res.json({ message: error.message, success: false });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userID = req.user.id;
    console.log(userID);
    
    // extract old password
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(userID);

    if (!user) {
      return res
        .status(400)
        .json({ message: "User Not found ", success: false });
    }
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is not correct! Please try again.",
      });
    }

    // hashing password
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);
    //update user password
    user.password = newHashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured! Please try again",
    });
  }
};
