import mongoose from "mongoose";

const homeDataSchema = new mongoose.Schema({
  id: { type: Number, required: true }, // ID field
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }, // Assuming image URL
  location: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const HomeDataModel = mongoose.model("HomeData", homeDataSchema);
export default HomeDataModel;
