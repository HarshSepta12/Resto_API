import Address from "../Model/Address.js";
import mongoose from "mongoose";


export const addAddress = async (req, res) => {
  try {
    const { fullAddress, city, pincode } = req.body;

    if (!fullAddress || !city || !pincode) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newAddress = new Address({
      fullAddress,
      city,
      pincode,
      user: req.user._id || req.user.id
    });

    await newAddress.save();

    return res.status(201).json({ message: "Address saved successfully", address: newAddress });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ message: "Server error while adding address" });
  }
};


export const getMyAddress = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    // console.log("User ID used to fetch address:", userId);

    // Convert to ObjectId if needed
    const objectId = new mongoose.Types.ObjectId(userId);

    const gettingAddress = await Address.find({ user: objectId });

    if (!gettingAddress || gettingAddress.length === 0) {
      return res.status(404).json({
        message: "No address found.",
        success: false
      });
    }

    res.json({
      message: "Your address is here.",
      address: gettingAddress,
      success: true
    });

  } catch (error) {
    console.error("Error fetching address:", error);
    res.status(500).json({
      message: "Something went wrong while fetching the address.",
      success: false
    });
  }
};

export const updateMyAddressById = async (req, res) => {
  try {
    const { fullAddress, city, pincode } = req.body;
    const addressId = req.params.id; // frontend se /address/update/:id aayega
    const userId = req.user?._id || req.user?.id;

    if (!fullAddress || !city || !pincode) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const updatedAddress = await Address.findOneAndUpdate(
      { _id: addressId, user: userId }, // ensure address belongs to this user
      { fullAddress, city, pincode },
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({ message: "Address not found or not authorized." });
    }

    res.json({
      message: "Address updated successfully.",
      address: updatedAddress,
      success: true
    });

  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({
      message: "Something went wrong.",
      success: false
    });
  }
};



