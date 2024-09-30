import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import CustomerModel from "../models/Customer_models.js"; // Import CustomerModel

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        // Step 1: Retrieve the token from cookies or Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        // Step 2: Check if token exists
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        // Step 3: Verify the token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Step 4: Find the user associated with the token
        const user = await CustomerModel.findById(decodedToken?._id).select("-password -refreshToken");

        // Step 5: Check if the user exists
        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        // Step 6: Attach user information to the request object
        req.user = user;
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});
