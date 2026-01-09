import type { Request, Response } from 'express';
import OfferModel from '../model/offerModel.js';
import ProductModel from '../model/productModel.js';

export const createOffer = async (req: Request, res: Response) => {
    try {
        const { title, discountPercentage, category, startDate, endDate } = req.body;

        const offer = new OfferModel({
            title,
            discountPercentage,
            category,
            startDate: startDate || new Date(),
            endDate: new Date(endDate)
        });
        await offer.save();

        // Apply Discount to Products
        const products = await ProductModel.find({ category: category });

        // Using for...of for sequence or Promise.all for parallel
        await Promise.all(products.map(async (product) => {
            // If product doesn't have a compareAtPrice, set it to current price (which is the original)
            let originalPrice = (product.compareAtPrice && product.compareAtPrice > product.price)
                ? product.compareAtPrice
                : product.price;

            const newPrice = Math.floor(originalPrice - (originalPrice * (Number(discountPercentage) / 100)));

            product.compareAtPrice = originalPrice;
            product.price = newPrice;
            await product.save();
        }));

        res.status(201).json(offer);
    } catch (error: any) {
        console.error("Error creating offer:", error);
        res.status(500).json({ error: "Failed to create offer" });
    }
};

export const getOffers = async (req: Request, res: Response) => {
    try {
        // Optional: Check for expiry here
        const now = new Date();
        const expiredOffers = await OfferModel.find({
            isActive: true,
            endDate: { $lt: now }
        });

        if (expiredOffers.length > 0) {
            // Revert prices for expired offers
            for (const offer of expiredOffers) {
                const products = await ProductModel.find({ category: offer.category });
                await Promise.all(products.map(async (p) => {
                    // Revert to compareAtPrice if it exists
                    if (p.compareAtPrice) {
                        p.price = p.compareAtPrice;
                        p.compareAtPrice = undefined as any;
                    }
                    await p.save();
                }));
                offer.isActive = false;
                await offer.save();
            }
        }

        const offers = await OfferModel.find().sort({ createdAt: -1 });
        res.status(200).json(offers);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteOffer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const offer = await OfferModel.findById(id);
        if (!offer) return res.status(404).json({ error: "Offer not found" });

        // Revert prices
        if (offer.isActive) {
            const products = await ProductModel.find({ category: offer.category });
            await Promise.all(products.map(async (p) => {
                if (p.compareAtPrice) {
                    p.price = p.compareAtPrice;
                    p.compareAtPrice = undefined as any;
                    await p.save();
                }
            }));
        }

        await OfferModel.findByIdAndDelete(id);
        res.json({ message: "Offer deleted and prices reverted" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
