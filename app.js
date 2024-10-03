import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import HomeDataModel from "./models/HomeDataModel.js"; // Moved up for better visibility
import userRouter from "./routes/Customer.routes.js";
import homeDataRouter from './routes/HomeData.routes.js';
const app = express();
const allowedOrigins = ['https://heven-hub-frontend.vercel.app']; 
app.use(cors({
    origin: allowedOrigins,
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
  })); // Enable CORS
app.use(express.json()); // Convert incoming JSON to JS objects
app.use(express.urlencoded({ extended: true })); // Added `extended: true` for complex objects
app.use(express.static("public"));
app.use(cookieParser()); // Used to perform CRUD operations on user's browser cookies

// Routes declaration
app.use("/api/v1/users", userRouter);

app.use("/api/v1/homeData", homeDataRouter);
export { app };
