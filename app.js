import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import HomeDataModel from "./models/HomeDataModel.js"; // Moved up for better visibility
import userRouter from "./routes/Customer.routes.js";
import homeDataRouter from './routes/HomeData.routes.js';
const app = express();

app.use(cors()); // Enable CORS
app.use(express.json()); // Convert incoming JSON to JS objects
app.use(express.urlencoded({ extended: true })); // Added `extended: true` for complex objects
app.use(express.static("public"));
app.use(cookieParser()); // Used to perform CRUD operations on user's browser cookies

// Routes declaration
app.use("/api/v1/users", userRouter);

// Fetch data from HomeDataModel
// app.get("/api/v1/home", (req, res) => {
//   HomeDataModel.find()
//     .then((data) => res.json(data)) // Corrected `resizeBy` to `res`
//     .catch((err) => res.status(500).json({ error: err.message })); // Improved error handling
// });

app.use("/api/v1/homeData", homeDataRouter);
export { app };
