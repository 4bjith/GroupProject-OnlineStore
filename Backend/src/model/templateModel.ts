import mongoose from "mongoose";

// Section schema
const SectionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['hero', 'productGrid', 'banner', 'features', 'testimonials', 'newsletter', 'footer', 'navbar', 'textBlock', 'imageBlock']
  },
  props: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  styles: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  order: {
    type: Number,
    required: true,
  },
  apiBinding: {
    source: {
      type: String,
      enum: ['api', 'static'],
      default: 'static'
    },
    endpoint: String,
    refreshInterval: Number
  },
  isVisible: {
    type: Boolean,
    default: true
  }
}, { _id: false });

// Page schema
const PageSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  sections: [SectionSchema],
  isDefault: {
    type: Boolean,
    default: false
  }
}, { _id: false });

// Template schema
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
  version: {
    type: Number,
    default: 1,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  isBaseTemplate: {
    type: Boolean,
    default: true,
  },
  parentTemplateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    default: null
  },
  pages: {
    type: [PageSchema],
    default: []
  },
  defaultThemeSettings: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Index for performance
templateSchema.index({ slug: 1 });
templateSchema.index({ parentTemplateId: 1 });
templateSchema.index({ isBaseTemplate: 1 });

// Update timestamp on save
templateSchema.pre('save', async function() {
  this.updatedAt = new Date();
});

const Template = mongoose.model("Template", templateSchema);
export default Template;
