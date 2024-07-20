import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authenticateJWT = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authorizationHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) {
      console.log("Error in auth");
      return res.status(403).json({ message: "No access" });
    }

    req.user = user;
    next();
  });
};

const verifyAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
};

export { authenticateJWT, verifyAdmin };
