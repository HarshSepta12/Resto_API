import express from "express";
import { createMenuItem, deleteMenuItem, getAllMenuItem } from "../Controllers/MenuItem.js";
import { authenticateToken } from "../Middelware/UerMiddelware.js";
import { isAdminUser } from "../Middelware/AdminMiddleware.js";

const router = express.Router();
router.post("/post", createMenuItem);
router.get("/get", getAllMenuItem);
router.delete("/delete/:id",authenticateToken, isAdminUser, deleteMenuItem);

export default router;