import express from "express";
import { authenticateToken } from "../Middelware/UerMiddelware.js";
import { isAdminUser } from "../Middelware/AdminMiddleware.js";

const router = express.Router();

router.get("/welcome", authenticateToken, isAdminUser, (req, res) => {
  res.json({
    message: `Welcome to the admin page`, success:true
  });
  //  console.log(req.user);
});

export default router;
