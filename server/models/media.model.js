import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    studyGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudyGroup",
    },
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    filename: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Media = mongoose.model("Media", mediaSchema);

export default Media;
