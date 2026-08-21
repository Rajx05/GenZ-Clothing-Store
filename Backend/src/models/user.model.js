import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: [true, "Username must be unique"],
  },

  email: {
    type: String,
    required: [true, "email is required"],
    unique: [true, "email must be unique"],
  },

  password: {
    type: String,
    required: [true, "password is required"],
  },

  name: {
    type: String,
    required: true,
  },

  listed_products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  verified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["buyer", "seller"],
    default: "buyer",
  },
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
