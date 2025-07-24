import express from "express"
import { bookTable } from "../Controllers/TableBook.js";
import { authenticateToken } from "../Middelware/UerMiddelware.js";
const router = express.Router();

router.post("/BookTable", authenticateToken, bookTable)

export default router;