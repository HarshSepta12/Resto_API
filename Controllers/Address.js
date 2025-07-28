import Address from "../Model/Address.js";


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
