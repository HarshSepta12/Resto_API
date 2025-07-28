import express from "express"
import { addAddress } from "../Controllers/Address.js";
import { authenticateToken } from "../Middelware/UerMiddelware.js";

const router = express.Router();

router.post("/addingAddress",authenticateToken, addAddress);

export default router;