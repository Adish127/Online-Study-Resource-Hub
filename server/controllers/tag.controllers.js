import Tag from "../models/tag.model.js";
import User from "../models/user.model.js";
import Resource from "../models/resource.model.js";

// Browse all tags
const browseAllTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Tag
const createTag = async (req, res) => {
  try {
    const { name, type, parent } = req.body;

    const tag = new Tag({ name, type, parent });

    // If parent
    if (parent) {
      const parentTag = await Tag.findById(parent);
      parentTag.children.push(tag._id);
      await parentTag.save();
    } else {
      tag.parent = tag._id;
    }

    await tag.save();

    res.status(200).json({ message: "Tag created" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to assign tags to any model in db, identified by model type and object id
const assignTags = async (req, res) => {
  try {
    const { type, id } = req.params;
    const { tags } = req.body;

    switch (type) {
      case "user":
        // Find user by id and update interests, dont change previous interests
        const user = await User.findByIdAndUpdate(id, {
          $addToSet: { interests: { $each: tags } },
        });
        await user.save();
        break;
      case "resource":
        // Find resource by id and update tags, dont change previous tags
        const resource = await Resource.findByIdAndUpdate(id, {
          $addToSet: { tags: { $each: tags } },
        });
        await resource.save();
        break;
      default:
        break;
    }

    res.status(200).json({ message: "Tags assigned" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to remove tags from any model in db, identified by model type and object id
const removeTags = async (req, res) => {
  try {
    const { type, id } = req.params;
    const { tags } = req.body;

    switch (type) {
      case "user":
        // Find user by id and remove interests
        const user = await User.findByIdAndUpdate(id, {
          $pull: { interests: { $in: tags } },
        });
        await user.save();
        break;
      case "resource":
        // Find resource by id and remove tags
        const resource = await Resource.findByIdAndUpdate(id, {
          $pull: { tags: { $in: tags } },
        });
        await resource.save();
        break;
      default:
        break;
    }

    res.status(200).json({ message: "Tags removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to delete tag from db
// const deleteTag = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const tag = await Tag.findById(id);

//     // Find all parent tags whose children array contains this tag id and remove this tag id from every parent's children array
//     const parentTags = await Tag.find({ children: { $in: [id] } });
//     parentTags.forEach(async (parentTag) => {
//       parentTag.children = parentTag.children.filter(
//         (child) => child.toString() !== id
//       );
//       await parentTag.save();
//     });

//     // Find all tags with this tag id as their parent and set their parent to themselves
//     const childrenTags = await Tag.find({ parent: id });
//     childrenTags.forEach(async (childTag) => {
//       childTag.parent = childTag._id;
//       await childTag.save();
//     });

//     // Find all users with this tag id in their interests and remove this tag id from every user's interests
//     const users = await User.find({ interests: { $in: [id] } });
//     users.forEach(async (user) => {
//       user.interests = user.interests.filter(
//         (interest) => interest.toString() !== id
//       );
//       await user.save();
//     });

//     // Find all resources with this tag id in their tags and remove this tag id from every resource's tags
//     const resources = await Resource.find({ tags: { $in: [id] } });
//     resources.forEach(async (resource) => {
//       resource.tags = resource.tags.filter((tag) => tag.toString() !== id);
//       await resource.save();
//     });

//     await tag.remove();

//     res.status(200).json({ message: "Tag deleted" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;

    const tag = await Tag.findById(id);
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    // Remove this tag id from all parent tags' children array
    await Tag.updateMany({ children: id }, { $pull: { children: id } });

    // Set parent to null for all tags with this tag id as their parent
    await Tag.updateMany({ parent: id }, { parent: null });

    // Remove this tag id from all users' interests
    await User.updateMany({ interests: id }, { $pull: { interests: id } });

    // Remove this tag id from all resources' tags
    await Resource.updateMany({ tags: id }, { $pull: { tags: id } });

    // Finally, remove the tag itself
    await Tag.deleteOne({ _id: id });

    res.status(200).json({ message: "Tag deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { browseAllTags, createTag, assignTags, removeTags, deleteTag };
