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
    const getAllMenuItem = await MenuItem.find().populate("category"); 
    if(!getAllMenuItem) return res.json({message: "Not Found MenuItem", success:false})
      res.json({message: "Your All Menu Item is Here...", getAllMenuItem, success:true});
  } catch (error) {
    res.status(404).json({
      message: "Failed to create menu item",
      error: error.message,
      success: false,
    });
  }
  }

export const getMenuById = async(req, res) => {
  const  id = req.params.id;
  try {
     const product = await MenuItem.findById(id);
  console.log(product);
  if(!product) return res.json({message: "Product is not Available", success:false});
  res.json({message: "Yoru Product is here...",product, success:true})
    
  } catch (error) {
      res.json({ message: error.message, success: false });
  }
 
}

  export const deleteMenuItem = async(req, res) => {
    try {
      const id = req.params.id;
      const getItem = await MenuItem.findByIdAndDelete(id);
      if(!getItem) return res.json({message: "NO Item Found For Delete", success:false});
         res.json({message: "Delete Succesfull", success: true});
    } catch (error) {
        res.json({ message: error.message, success: false });
    }
  }

  export const editMenuItem = async(req, res) => {
    const id = req.params.id;
     const {
      name,
      description,
      price,
      imageUrl,
      isAvailable,
      spiceLevel,
      ingredients,
      category
    } = req.body;
    const updatedData = {name,
    description, price, imageUrl, isAvailable, spiceLevel, ingredients, category
    };
    try {
      const getItemForEdit = await MenuItem.findByIdAndUpdate(id, updatedData, {new:true});
      
      if(!getItemForEdit) return res.json({  message: "No data found for update", success:false})
        res.json({message: "Record Update Successfull...", success:true})
    } catch (error) {
       res.json({ message: error.message, success: false });
    }
  }