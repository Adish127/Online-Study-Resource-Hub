import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";

dotenv.config();

// App Config
const app = express();

// Inbuilt Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// API Routes
app.use("/api/auth", authRoutes);

connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on PORT ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error, "MongoDB failed to connect");
  });
