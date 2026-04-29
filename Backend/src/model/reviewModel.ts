import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  parentReviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review",
    default: null
  },
  isReply: {
    type: Boolean,
    default: false
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for better query performance
reviewSchema.index({ productId: 1 });
reviewSchema.index({ userId: 1 });
reviewSchema.index({ parentReviewId: 1 });
reviewSchema.index({ storeId: 1 });

// Virtual for replies
reviewSchema.virtual('replies', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'parentReviewId'
});

const ReviewModel = mongoose.model("Review", reviewSchema);
export default ReviewModel;
