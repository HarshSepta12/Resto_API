import cron from "node-cron";
import { TableBook } from "../Model/TableBook.js";

export const startBookingStatusUpdater = () => {
  cron.schedule("*/1 * * * *", async () => {
    try {
      const now = new Date();

      // Get current date in yyyy-mm-dd format
      const currentDateStr = now.toISOString().split("T")[0]; // e.g., "2025-07-28"
      const currentTimeStr = now.toTimeString().split(" ")[0]; // e.g., "14:10:00"

      // Get current Date object from currentDateStr and currentTimeStr
      const nowTimestamp = new Date(`${currentDateStr}T${currentTimeStr}`);

      // Fetch all pending bookings
      const bookings = await TableBook.find({ status: "pending" });

      let updatedCount = 0;

      for (const booking of bookings) {
        // Assume booking.date = "2025-07-28", booking.time = "14:00"
        const bookingTimestamp = new Date(`${booking.date}T${booking.time}`);

        if (bookingTimestamp < nowTimestamp) {
          // Mark it as completed
          await TableBook.updateOne(
            { _id: booking._id },
            { $set: { status: "completed" } }
          );
          updatedCount++;
        }
      }

      if (updatedCount > 0) {
        console.log(`[CRON] ${updatedCount} bookings marked as completed.`);
      }
    } catch (err) {
      console.error("[CRON] Booking status update failed:", err);
    }
  });
};
