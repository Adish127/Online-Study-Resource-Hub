import Comment from "../models/comment.model.js";
import Resource from "../models/resource.model.js";

// Add comments to a resource
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const user = req.user;
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    const comment = new Comment({
      text,
      user: user.id,
      resource: resource.id,
    });

    await comment.save();
    resource.comments.push(comment._id);
    await resource.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all comments for a resource
const displayComments = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).populate(
      "comments"
    );
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.status(200).json(resource.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const resource = await Resource.findById(comment.resource);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    if (comment.user.toString() !== req.user.id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await Comment.findByIdAndDelete(comment._id);
    resource.comments = resource.comments.filter(
      (commentId) => commentId.toString() !== comment._id.toString()
    );
    await resource.save();

    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { addComment, displayComments, deleteComment };
