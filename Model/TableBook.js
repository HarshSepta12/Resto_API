import mongoose, { model } from "mongoose"

const tableBook = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    time: { type: String, required: true }, // alternatively: Date
    guests: { type: Number, required: true }, // ye select box se aayega
    specialRequest: { type: String }, // optional textarea
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // ref field
});

    
    export const TableBook =  mongoose.model("TableBook",tableBook )