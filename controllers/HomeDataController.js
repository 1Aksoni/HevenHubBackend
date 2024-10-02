import HomeDataModel from "../models/HomeDataModel.js"; // Import the HomeData model

// Controller function to fetch all home data
export const getHomeData = async (req, res) => {
  try {
    const data = await HomeDataModel.find();
    if (data.length === 0) {
      return res.status(404).json({ message: "No data found in the collection" });
    }
    res.status(200).json(data); // Send data as a JSON response
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error: error.message });
  }
};

