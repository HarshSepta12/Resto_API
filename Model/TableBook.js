import mongoose from "mongoose";

const tableBook = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true },
    specialRequest: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "RegisterUser", required: true },
    status: { type: String, default: "pending" },
    createdAt: { type: Date, default: Date.now }
});

export const TableBook = mongoose.model("TableBook", tableBook);