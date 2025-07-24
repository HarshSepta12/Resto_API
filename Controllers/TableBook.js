
import { TableBook } from "../Model/TableBook.js"; 
import { sendEmail } from "../utils/SendEmail.js";

export const bookTable = async (req, res) => {
  try {
    const { name, email, time, guests, specialRequest } = req.body;
    const userId = req.user._id || req.user.id;

    if (!name || !email || !time || !guests) {
      return res.status(400).json({ success: false, message: "Please fill all required fields" });
    }

    const newBooking = new TableBook({
      name,
      email,
      time,
      guests,
      specialRequest,
      user: userId,
    });

    await newBooking.save();

    const emailHTML = `
      <h2>Hi ${name},</h2>
      <p>Your table has been successfully booked.</p>
      <ul>
        <li><strong>Date & Time:</strong> ${time}</li>
        <li><strong>Guests:</strong> ${guests}</li>
        <li><strong>Special Request:</strong> ${specialRequest || "None"}</li>
      </ul>
      <p>Thank you for booking with us!</p>
    `;

    try {
      await sendEmail(email, "Table Booking Confirmation", emailHTML);
    } catch (emailErr) {
      console.error("Email send failed:", emailErr.message);
    }

    res.status(201).json({ success: true, message: "Table booked", booking: newBooking });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
