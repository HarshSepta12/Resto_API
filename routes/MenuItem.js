import express from "express";
import { createMenuItem, getAllMenuItem } from "../Controllers/MenuItem.js";

const router = express.Router();
router.post("/post", createMenuItem);
router.get("/get", getAllMenuItem);

export default router;