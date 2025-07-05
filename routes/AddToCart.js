import express from "express";
import { addToCart, getCartItems,decreaseCartItemQuantity  } from "../Controllers/AddToCart.js";
import { authenticateToken } from "../Middelware/UerMiddelware.js";

const router = express.Router();

router.post("/add", authenticateToken, addToCart);
router.get("/getCart",authenticateToken, getCartItems );
router.put("/decrease", authenticateToken, decreaseCartItemQuantity); // POST or PUT, your choice

export default router;