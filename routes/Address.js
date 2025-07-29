import express from "express"
import { addAddress, getMyAddress, updateMyAddressById } from "../Controllers/Address.js";
import { authenticateToken } from "../Middelware/UerMiddelware.js";

const router = express.Router();

router.post("/addingAddress",authenticateToken, addAddress);
router.get("/getMyAddress",authenticateToken, getMyAddress);

router.put("/updateMyAddress/:id",authenticateToken, updateMyAddressById);

export default router;