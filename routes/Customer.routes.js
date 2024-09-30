import { Router } from "express";
import {
  registerCustomer,
  loginCustomer,
  logoutUser,
} from "../controllers/CustomerRegister.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
// import HomeData from "../controllers/PropertyController.js"

const router = Router();

// Route for customer registration
router.route("/register").post(async (req, res, next) => {
  console.log("Registration request received:", req.body);
  next(); // Continue to the actual handler
}, registerCustomer);


// Route for customer login
router.route("/login").post(loginCustomer);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);

// router.route("/properties").get(HomeData);

export default router;
