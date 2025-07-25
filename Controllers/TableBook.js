import { TableBook } from "../Model/TableBook.js";
import { sendEmail } from "../utils/SendEmail.js";
// import { sendSMS } from "../utils/SendSMS.js";

export const bookTable = async (req, res) => {
  try {
    const { name, email, phone, time, guests, specialRequest } = req.body;
    const userId = req.user._id || req.user.id;

    // Validation
    if (!name || !email || !phone || !time || !guests) {
      return res.status(400).json({ 
        success: false, 
        message: "Please fill all required fields (name, email, phone, time, guests)" 
      });
    }

    // Phone number validation
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number"
      });
    }

    // Format phone number (add country code if missing)
    let formattedPhone = phone.replace(/\D/g, '');
    if (formattedPhone.length === 10 && !phone.startsWith('+')) {
      // For Indian numbers, add +91
      formattedPhone = '+91' + formattedPhone;
    } else if (!phone.startsWith('+')) {
      formattedPhone = '+' + formattedPhone;
    } else {
      formattedPhone = phone;
    }

    // Create new booking
    const newBooking = new TableBook({
      name,
      email,
      phone: formattedPhone,
      time,
      guests,
      specialRequest,
      user: userId,
    });

    await newBooking.save();

    // Format date and time for display
    const bookingDate = new Date(time);
    const formattedDateTime = bookingDate.toLocaleString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Prepare email content
    const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d4a574;">🎉 Table Booking Confirmed!</h2>
        <p>Dear <strong>${name}</strong>,</p>
        <p>Your table has been successfully booked at <strong>Shree Aaiji Restaurant</strong>.</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">📋 Booking Details:</h3>
          <ul style="line-height: 1.8;">
            <li><strong>🗓️ Date & Time:</strong> ${formattedDateTime}</li>
            <li><strong>👥 Number of Guests:</strong> ${guests}</li>
            <li><strong>📱 Phone:</strong> ${formattedPhone}</li>
            <li><strong>📧 Email:</strong> ${email}</li>
            <li><strong>📝 Special Request:</strong> ${specialRequest || "None"}</li>
            <li><strong>🆔 Booking ID:</strong> ${newBooking._id.toString().slice(-8)}</li>
          </ul>
        </div>

        <div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>📍 Restaurant Address: Raipuriya 457775, Petlawad , Jhabua</strong><br>
          Shree Aaiji Restaurant<br>
          Raipuriya 457775 Bypass Road Raipuriya Tehsil Petlawad District Jhabua<br>
          Phone: 7074916634</p>
        </div>

        <p>We look forward to serving you! If you need to make any changes, please contact us.</p>
        <p style="color: #d4a574;"><strong>Thank you for choosing Shree Aaiji Restaurant!</strong></p>
        
        <hr style="margin: 30px 0;">
        <p style="font-size: 12px; color: #666;">
          This is an automated confirmation email. Please save this for your records.
        </p>
      </div>
    `;

    // Prepare SMS content
    const smsMessage = `🎉 Booking Confirmed! Dear ${name}, your table is booked for ${formattedDateTime} for ${guests} guests at Shree Aaiji Restaurant. Booking ID: ${newBooking._id.toString().slice(-8)}. Thank you!`;

    // Send email (existing functionality)
    try {
      await sendEmail(email, "Table Booking Confirmation - Shree Aaiji Restaurant", emailHTML);
      console.log("✅ Email sent successfully");
    } catch (emailErr) {
      console.error("❌ Email send failed:", emailErr.message);
    }

    // Send SMS (new functionality)
    try {
      await sendSMS(formattedPhone, smsMessage);
      console.log("✅ SMS sent successfully to:", formattedPhone);
    } catch (smsErr) {
      console.error("❌ SMS send failed:", smsErr.message);
      // Don't fail the booking if SMS fails
    }

    res.status(201).json({ 
      success: true, 
      message: "Table booked successfully! Check your email and SMS for confirmation.", 
      booking: {
        id: newBooking._id,
        name: newBooking.name,
        email: newBooking.email,
        phone: newBooking.phone,
        time: newBooking.time,
        guests: newBooking.guests,
        status: newBooking.status
      }
    });

  } catch (error) {
    console.error("❌ Booking error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Something went wrong while booking the table" 
    });
  }
};


export const getAllBookings = async (req, res) => {
  try {
    const bookings = await TableBook.find()
      .populate('user', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings"
    });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await TableBook.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Send status update SMS
    let statusMessage = '';
    switch (status) {
      case 'confirmed':
        statusMessage = `✅ Your table booking for ${new Date(booking.time).toLocaleDateString()} is CONFIRMED! We're excited to serve you at Shree Aaiji Restaurant.`;
        break;
      case 'cancelled':
        statusMessage = `❌ Your table booking for ${new Date(booking.time).toLocaleDateString()} has been CANCELLED. Contact us if you have questions. - Shree Aaiji Restaurant`;
        break;
    }

    if (statusMessage) {
      try {
        await sendSMS(booking.phone, statusMessage);
      } catch (smsErr) {
        console.error("Status SMS failed:", smsErr.message);
      }
    }

    res.status(200).json({
      success: true,
      message: "Booking status updated",
      booking
    });

  } catch (error) {
    console.error("Status update error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update booking status"
    });
  }
};