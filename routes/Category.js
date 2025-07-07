import expres from "express";
import { getAllCategory, postCategory, updateCategory, deleteCategory } from "../Controllers/Category.js";
const router = expres.Router();

router.post("/post", postCategory);
router.get("/get", getAllCategory);
router.put("/update/:id", updateCategory);
router.delete("/delete/:id", deleteCategory);
export default router;