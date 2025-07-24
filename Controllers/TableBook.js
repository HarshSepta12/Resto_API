
import { TableBook } from "../Model/TableBook.js"; 
import { sendEmail } from "../utils/SendEmail.js";

export const bookTable = async (req, res) => {
  try {
    const { name, email, time, guests, specialRequest } = req.body;
    const userId = req.user._id || req.user.id;
;

    if (!name || !email || !time || !guests) {
      return res.status(400).json({ message: "Please fill all required fields" });
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

    // Send confirmation email
    const emailHTML = `
      <h2>Hi ${name},</h2>
      <p>Your table has been successfully booked.</p>
      <p><strong>Booking Details:</strong></p>
      <ul>
        <li><strong>Date & Time:</strong> ${time}</li>
        <li><strong>Guests:</strong> ${guests}</li>
        <li><strong>Special Request:</strong> ${specialRequest || "None"}</li>
      </ul>
      <p>Thank you for booking with us!</p>
    `;

   // await sendEmail(email, "Table Booking Confirmation", emailHTML);
   try {
  await sendEmail(email, "Table Booking Confirmation", emailHTML);
} catch (emailErr) {
  console.error("Email send failed:", emailErr.message);
}

    res.status(201).json({ message: "Table booked & confirmation email sent", booking: newBooking });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
