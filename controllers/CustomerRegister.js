import CustomerModel from "../models/Customer_models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"; // Importing asyncHandler

// Function to generate access and refresh tokens
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await CustomerModel.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Optional: Store the refresh token in the database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating refresh and access token.");
  }
};

// Register Customer Function with asyncHandler
const registerCustomer = asyncHandler(async (req, res) => {
  const { fname, lname, email, phone, password } = req.body;

  // Step 1: Validate required fields
  if (!fname || !lname || !email || !password) {
    throw new ApiError(400, "Please fill out all required fields.");
  }

  // Step 2: Check if a customer with the same email already exists
  const existingCustomer = await CustomerModel.findOne({ email });
  if (existingCustomer) {
    throw new ApiError(400, "Email already exists. Please use a different email.");
  }

  // Step 3: Create a new customer in the database
  const newCustomer = await CustomerModel.create({
    fname,
    lname,
    email,
    phone,
    password, // This will be hashed in the pre-save hook
    refreshToken: null, // Initialize the refreshToken field
  });

  // Step 4: Generate access and refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(newCustomer._id);

  // Optional: Store the refresh token in the database
  newCustomer.refreshToken = refreshToken;
  await newCustomer.save({ validateBeforeSave: false }); // Save the updated customer document

  // Step 5: Send success response using ApiResponse
  const response = new ApiResponse(201, { accessToken, refreshToken }, "Customer registered successfully.");
  res.status(response.statusCode).json(response);
});



// Login Customer Function with asyncHandler
const loginCustomer = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Step 1: Validate email and password
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required.");
  }

  // Step 2: Find the customer by email
  const customer = await CustomerModel.findOne({ email });
  if (!customer) {
    throw new ApiError(400, "Incorrect email.");
  }

  // Step 3: Compare the password using the method defined in the model
  const isPasswordValid = await customer.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(400, "Incorrect password.");
  }

  // Step 4: Generate access and refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(customer._id);
  
  // Optional: If you want to return the user data without sensitive information
  const loggedInUser = await CustomerModel.findById(customer._id).select("-password -refreshToken");

  // Step 5: Send success response using ApiResponse
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
  };

  // Set cookies for tokens if needed
  res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .status(200)
    .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "Login successful."));
});



// Logout Customer Function with asyncHandler
const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user._id; 

  // Step 1: Update the user to unset the refreshToken
  await CustomerModel.findByIdAndUpdate(
      userId,
      {
          $unset: {
              refreshToken: "" // this removes the field from the document
          }
      },
      {
          new: true
      }
  );

  // Step 2: Set options for cookies
  const options = {
      httpOnly: true,
      secure: true, // Set to true if using HTTPS
      sameSite: 'Strict', // Optional: Set SameSite attribute for additional security
  };

  // Step 3: Clear cookies and send response
  return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged out successfully."));
});
// Export the functions
export { loginCustomer, registerCustomer,logoutUser };
