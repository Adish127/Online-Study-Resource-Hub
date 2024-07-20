// Import necessary modules
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Import configs
import connectDB from "./utils/db.js";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import resourceRoutes from "./routes/resource.routes.js";

dotenv.config();

// App Config
const app = express();

// Inbuilt Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// API Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/v2/users", userRoutes);
app.use("/api/v2/resources", resourceRoutes);

connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on PORT ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error, "MongoDB failed to connect");
  });
