// index.js
import express from "express";
import { dbConnect } from "./Db/DbConnection.js";
import UserRoute  from "./routes/UserRoute.js";
import AdminRoutes from './routes/adminRoutes.js';
import CategoryRoutes from './routes/Category.js';
import MenuItemRoutes from './routes/MenuItem.js';
import paymentRoutes from './routes/Payment.js';


import cors from "cors";
import AddtocartRoutes from "./routes/AddToCart.js"
import Booktable from "./routes/TableBook.js"
import dotenv from 'dotenv';
const app = express();
// This should come before using process.env


dotenv.config();
app.use(express.json());
app.use(cors());
const port = 1200;

dbConnect(); 

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});

app.use("/api/user", UserRoute);
app.use("/api/admin", AdminRoutes);
app.use("/api/category", CategoryRoutes);
app.use("/api/menuItem", MenuItemRoutes);
app.use("/api/Addtocart", AddtocartRoutes);
app.use("/api/booking", Booktable);
app.use('/api/payment', paymentRoutes);