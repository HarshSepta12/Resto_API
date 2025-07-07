import { Category } from "../Model/Category.js";

export const postCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const oneCategory = new Category({ name, description });
    await oneCategory.save();

    res.json({
      message: "Category saved to database",
      oneCategory,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error saving category",
      error: error.message,
      success: false,
    });
  }
};

export const getAllCategory = async (req, res) => {
  try {
    const getCategory = await Category.find();
    if (!getCategory)
      return res.json({ message: "Not Found Category", success: false });
    res.json({
      message: "Your All Types of Category is Here...",
      getCategory,
      success: true,
    });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};



export const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const updatedData = { name, description };
    const id = req.params.id;

    const updatedCategory = await Category.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedCategory) {
      return res.json({
        message: "No data found for update",
        success: false,
      });
    }

    res.json({
      message: "Category updated successfully",
      updatedCategory,
      success: true,
    });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};


export const deleteCategory = async(req, res) => {
     try {
           const id = req.params.id;
     const getDeleteCategory = await Category.findByIdAndDelete(id);
     if(!getDeleteCategory) return res.json({message: "Not Found Data for Delete", success:false});
     res.json({message: "Delete Succesfull", success: true});
     } catch (error) {
           res.json({ message: error.message, success: false });
     }
    
}