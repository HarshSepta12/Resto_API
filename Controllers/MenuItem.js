import { MenuItem } from "../Model/MenuItem.js";

export const createMenuItem = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      imageUrl,
      isAvailable,
      spiceLevel,
      ingredients,
      category,
    } = req.body;

    const newItem = new MenuItem({
      name,
      description,
      price,
      imageUrl,
      isAvailable,
      spiceLevel,
      ingredients,
      category,
    });

    // Save to DB
    await newItem.save();

    res.status(201).json({
      message: "Menu item created successfully",
      menuItem: newItem,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create menu item",
      error: error.message,
      success: false,
    });
  }
};


export const getAllMenuItem = async(req, res) => {
  try {
    const getAllMenuItem = await MenuItem.find();
    if(!getAllMenuItem) return res.json({message: "Not Found MenuItem", success:false})
      res.json({message: "Your All Menu Item is Here...", getAllMenuItem, success:true});
  } catch (error) {
    
  }
}