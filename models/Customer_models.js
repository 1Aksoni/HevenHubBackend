import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Define customer schema
const customerSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Email must be unique and required
  phone: { type: String, required: false }, // Phone is optional
  password: { type: String, required: true }, // Password must be required
  refreshToken: {
    type: String,
  },
});

// Pre-save hook to hash the password before saving to the database
customerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10); // Hash the password
    next(); // Call next() to proceed with the save operation
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
});

// Method to compare the provided password with the stored (hashed) password
customerSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate an access token
customerSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" } // Default to 15 minutes if not set
  );
};

// Method to generate a refresh token
customerSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" } // Default to 7 days if not set
  );
};

// Export the model
const CustomerModel = mongoose.model("Customer", customerSchema);

export default CustomerModel;
