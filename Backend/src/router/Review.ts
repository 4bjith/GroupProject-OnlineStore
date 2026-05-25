import express from "express";
import {
    createReview,
    getReviewsByProduct,
    getReviewById,
    updateReview,
    deleteReview,
    getReviewsByStore,
    getReviewStats
} from "../controller/reviewController.js";

const router = express.Router();

// CREATE REVIEW
router.post("/reviews", createReview);

// READ
router.get("/reviews/:id", getReviewById);
router.get("/reviews/product/:productId", getReviewsByProduct);
router.get("/reviews/store/:storeId", getReviewsByStore);
router.get("/reviews/stats/product/:productId", getReviewStats);

// UPDATE
router.put("/reviews/:id", updateReview);

// DELETE
router.delete("/reviews/:id", deleteReview);

export default router;
