import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, //"dcennwifb",
  api_key: process.env.CLOUDINARY_API_KEY, //"819944886548216",
  api_secret: process.env.CLOUDINARY_API_SECRET, //"Gj84tkawSL9PKagYm6fJ0kehfN4",
});

export default cloudinary;
