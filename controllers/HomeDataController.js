import HomeDataModel from "../models/HomeDataModel.js"; // Import the HomeData model

// Controller function to fetch all home data
export const getHomeData = async (req, res) => {
  try {
    console.log("Fetching home data..."); // Log to see if the route is reached
    const homeData = await HomeDataModel.find();
    console.log(homeData); // Log the data fetched from the database
    res.json(homeData);
  } catch (error) {
    console.error("Error fetching home data:", error); // Log errors
    res.status(500).json({ message: "Failed to fetch home data" });
  }
};

