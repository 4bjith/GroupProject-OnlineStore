import mongoose from "mongoose";



const templateSchema = new mongoose.Schema  ({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  content: {
    type: String,
  },
  previewImage: {
    type: String,
  },
  primaryColor: {
    type: String,
  },
  secondaryColor: {
    type: String,
  },
  author: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});



const Template = mongoose.model("Template", templateSchema);
export default Template;
