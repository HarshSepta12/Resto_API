import express from "express";
import {
  RegisterUser,
  deleteUser,
  getAllUser,
  LoginUser,
  getMyProfile,
  UpdateUser,
  changePassword
} from "../Controllers/userControllers.js";
import { authenticateToken } from "../Middelware/UerMiddelware.js";
import { isAdminUser } from "../Middelware/AdminMiddleware.js";

const router = express.Router();

router.post("/useradd", RegisterUser);
router.post("/login", LoginUser); 

router.get("/getAllUser",  getAllUser);
router.get("/dashboard", authenticateToken, getMyProfile);

router.put("/updateUser/:id", authenticateToken, UpdateUser);
// router.delete("/deleteUser/:id",authenticateToken, isAdminUser, deleteUser);
 router.delete("/deleteUser/:id", deleteUser);

router.post("/change-password", authenticateToken, changePassword);

export default router;
