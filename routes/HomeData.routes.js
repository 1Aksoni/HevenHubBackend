import express from "express";
import { getHomeData } from "../controllers/HomeDataController.js";

const router = express.Router();

router.get("/", getHomeData);

export default router;
