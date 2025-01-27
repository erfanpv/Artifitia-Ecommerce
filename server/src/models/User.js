import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "carts",
    },
    wishlist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "wishlists",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
