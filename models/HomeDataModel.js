import mongoose from "mongoose";

const homeDataSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }, // Assuming it's a URL or image path
});

// Explicitly specify the collection name
const HomeDataModel = mongoose.model("homedata", homeDataSchema, "homedata");

export default HomeDataModel;
