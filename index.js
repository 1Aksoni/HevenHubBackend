import express from "express";
import cors from "cors";
import dotenv from "dotenv"; // Use import instead of require for dotenv
import connectDB from "./db/db.js";
import {app} from './app.js'
// Initialize dotenv before using environment variables
dotenv.config();

// const app = express(); // Move app initialization before starting the server
app.use(express.json()); // Convert incoming JSON to JS objects
app.use(cors()); // Enable CORS

// Connect to MongoDB and then start the server
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at PORT: ${process.env.PORT || 8000}`);
    });
  })
  .catch((error) => {
    console.log("MONGODB Connection Failed !!!", error);
  });

