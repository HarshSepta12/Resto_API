import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  fullAddress: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "RegisterUser", required: true },
  createdAt: { type: Date, default: Date.now }
});


const Address = mongoose.model("Address", addressSchema);
export default Address;
