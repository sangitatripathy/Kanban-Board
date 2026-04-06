import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import organisationRoute from "./Routes/organizationRoute.js";
import inviteRoute from "./Routes/invite.js";
import boardRoute from "./Routes/boardRoute.js"
import memberRoute from './Routes/members.js'
import { createClient } from "redis";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(
  morgan("combined", {
    skip: (req, res) => res.statusCode < 400,
  }),
);

/*Middleware*/
app.use(express.json());

/*connect to MongoDB*/
connectDB();

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  console.log("missing redis URL");
  process.exit(1);
}

export const redisClient = createClient({
  url: redisUrl,
});

try {
  await redisClient.connect();
  console.log("connected to redis client");
} catch (err) {
  console.error("Redis connection failed:", err);
}


/* Routes */
app.use("/api/auth", authRoute);
app.use("/api/org",organisationRoute);
app.use("/api/invite",inviteRoute);
app.use("/api/org",boardRoute);
app.use("/api/member",memberRoute)
app.use("/uploads", express.static("uploads"));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

app.get("/test", async (req, res) => {
  try {
    const result = await model.generateContent("Explain how AI works in a few words");
    const response = await result.response;
    const text = response.text();

    console.log(text);
    
    res.status(200).json({
      success: true,
      data: text
    });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to generate content" 
    });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on PORT http://localhost:${PORT}`);
});
