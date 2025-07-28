// routes/TableBook.js
import express from "express";
import { bookTable, getAllBookings, getMyBooking, updateBookingStatus } from "../Controllers/TableBook.js";
import { authenticateToken } from "../Middelware/UerMiddelware.js";


const router = express.Router();

// Book a table (requires authentication)
router.post("/BookTable", authenticateToken, bookTable);


// Get My Booking
router.get("/getMyBookings", authenticateToken, getMyBooking);


// Get all bookings (admin only)
// router.get("/getAllBookings", authenticateToken, getAllBookings);

// // Update booking status (admin only)
// router.put("/updateStatus/:id", authenticateToken, updateBookingStatus);

// // Test SMS functionality (development only)
// router.post("/testSMS", async (req, res) => {
//   try {
//     // await testSMS();
//     res.json({ success: true, message: "SMS test initiated" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "SMS test failed", error: error.message });
//   }
// });

export default router;