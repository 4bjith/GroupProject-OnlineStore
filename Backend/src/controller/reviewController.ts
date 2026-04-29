import ReviewModel from "../model/reviewModel.js";
import ProductModel from "../model/productModel.js";
import StoreModel from "../model/Store.js";
import UserModel from "../model/User.js";

// CREATE REVIEW
export const createReview = async (req: any, res: any) => {
  try {
    const { userId, productId, storeId, rating, title, comment, parentReviewId } = req.body;

    // Validate required fields
   if (!parentReviewId){
     if (!userId || !productId || !storeId || !rating || !title || !comment) {
      return res.status(400).json({ error: "Missing required fields" });
    }
   }else{
     if (!userId || !productId || !storeId || !comment) {
      return res.status(400).json({ error: "Missing required fields" });
    }
   }

    // Validate rating (only for main reviews, not replies)
    if (!parentReviewId) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Rating must be between 1 and 5" });
      }
    }

    // Check if product exists
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if store exists
    const store = await StoreModel.findById(storeId);
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    // Check if user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if it's a reply
    let isReply = false;
    if (parentReviewId) {
      const parentReview = await ReviewModel.findById(parentReviewId);
      if (!parentReview) {
        return res.status(404).json({ error: "Parent review not found" });
      }
      isReply = true;
    }

    // Create review
    const review = new ReviewModel({
      userId,
      productId,
      storeId,
      rating: isReply ? 0 : rating, // Replies don't affect rating
      title,
      comment,
      parentReviewId: parentReviewId || null,
      isReply
    });

    await review.save();

    // Update product rating stats if it's not a reply
    if (!isReply) {
      await updateProductRating(productId);
    }

    // Populate review with user info
    const populatedReview = await ReviewModel.findById(review._id)
      .populate('userId', 'name email profilePic')
      .populate('productId', 'title')
      .exec();

    res.status(201).json(populatedReview);
  } catch (error: any) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Failed to create review", details: error.message });
  }
};

// GET REVIEWS BY PRODUCT
export const getReviewsByProduct = async (req: any, res: any) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = 'newest' } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Sort options
    let sortOption: any = { createdAt: -1 }; // newest first
    if (sort === 'highest') {
      sortOption = { rating: -1, createdAt: -1 };
    } else if (sort === 'lowest') {
      sortOption = { rating: 1, createdAt: -1 };
    }

    // Get main reviews (not replies)
    const reviews = await ReviewModel.find({ 
      productId, 
      parentReviewId: null,
      deletedAt: null 
    })
      .populate('userId', 'name email profilePic')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    // Get replies for each review
    const reviewIds = reviews.map(r => r._id);
    const replies = await ReviewModel.find({ 
      parentReviewId: { $in: reviewIds },
      deletedAt: null 
    })
      .populate('userId', 'name email profilePic')
      .sort({ createdAt: 1 });

    // Attach replies to their parent reviews
    const reviewsWithReplies = reviews.map(review => ({
      ...review.toObject(),
      replies: replies.filter(r => r.parentReviewId?.toString() === review._id.toString())
    }));

    const total = await ReviewModel.countDocuments({ 
      productId, 
      parentReviewId: null,
      deletedAt: null 
    });

    res.status(200).json({
      data: reviewsWithReplies,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error: any) {
    console.error("Error getting reviews:", error);
    res.status(500).json({ error: "Failed to get reviews", details: error.message });
  }
};

// GET REVIEW BY ID
export const getReviewById = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const review = await ReviewModel.findById(id)
      .populate('userId', 'name email profilePic')
      .populate('productId', 'title')
      .populate('storeId', 'name');

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Get replies
    const replies = await ReviewModel.find({ 
      parentReviewId: id,
      deletedAt: null 
    })
      .populate('userId', 'name email profilePic')
      .sort({ createdAt: 1 });

    res.status(200).json({
      ...review.toObject(),
      replies
    });
  } catch (error: any) {
    console.error("Error getting review:", error);
    res.status(500).json({ error: "Failed to get review", details: error.message });
  }
};

// UPDATE REVIEW
export const updateReview = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { rating, title, comment } = req.body;

    const review = await ReviewModel.findById(id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Update fields
    if (rating && !review.isReply) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Rating must be between 1 and 5" });
      }
      review.rating = rating;
    }
    if (title) review.title = title;
    if (comment) review.comment = comment;
    review.isEdited = true;

    await review.save();

    // Update product rating stats if it's not a reply
    if (!review.isReply) {
      await updateProductRating(review.productId.toString());
    }

    const updatedReview = await ReviewModel.findById(id)
      .populate('userId', 'name email profilePic')
      .populate('productId', 'title');

    res.status(200).json(updatedReview);
  } catch (error: any) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Failed to update review", details: error.message });
  }
};

// DELETE REVIEW
export const deleteReview = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const review = await ReviewModel.findById(id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Soft delete
    review.deletedAt = new Date();
    await review.save();

    // Update product rating stats if it's not a reply
    if (!review.isReply) {
      await updateProductRating(review.productId.toString());
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Failed to delete review", details: error.message });
  }
};

// GET REVIEWS BY STORE (for dashboard)
export const getReviewsByStore = async (req: any, res: any) => {
  try {
    const { storeId } = req.params;
    const { page = 1, limit = 10, rating, productId, sort = 'newest' } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Build filter
    const filter: any = { storeId, deletedAt: null };
    if (rating) filter.rating = Number(rating);
    if (productId) filter.productId = productId;

    // Sort options
    let sortOption: any = { createdAt: -1 };
    if (sort === 'highest') {
      sortOption = { rating: -1, createdAt: -1 };
    } else if (sort === 'lowest') {
      sortOption = { rating: 1, createdAt: -1 };
    }

    const reviews = await ReviewModel.find(filter)
      .populate('userId', 'name email profilePic')
      .populate('productId', 'title')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await ReviewModel.countDocuments(filter);

    res.status(200).json({
      data: reviews,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error: any) {
    console.error("Error getting store reviews:", error);
    res.status(500).json({ error: "Failed to get store reviews", details: error.message });
  }
};

// GET REVIEW STATISTICS
export const getReviewStats = async (req: any, res: any) => {
  try {
    const { productId } = req.params;

    const reviews = await ReviewModel.find({ 
      productId, 
      parentReviewId: null,
      deletedAt: null 
    });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
      : 0;

    // Rating distribution
    const ratingDistribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    };

    reviews.forEach(review => {
      ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
    });

    res.status(200).json({
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution
    });
  } catch (error: any) {
    console.error("Error getting review stats:", error);
    res.status(500).json({ error: "Failed to get review stats", details: error.message });
  }
};

// Helper function to update product rating
async function updateProductRating(productId: string) {
  try {
    const reviews = await ReviewModel.find({ 
      productId, 
      parentReviewId: null,
      deletedAt: null 
    });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
      : 0;

    await ProductModel.findByIdAndUpdate(productId.toString(), {
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: totalReviews
    });
  } catch (error) {
    console.error("Error updating product rating:", error);
  }
}
