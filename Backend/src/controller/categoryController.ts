import express from 'express';
import categoryModel from '../model/categoryModel.js';

export const createCategory = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { storeId, catname, catimage: imageFromBody } = req.body;

    let catimage: string | undefined;

    if (req.file) {
      catimage = req.file.path.replace(/\\/g, "/");
    } else if (imageFromBody) {
      catimage = imageFromBody;
    }
    if (!storeId || !catname || !catimage) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newCategory = await categoryModel.create({
      storeId,
      catname,
      catimage,
    });

    res.status(201).json(newCategory);
    // console.log(newCategory)
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getAllCategories = async (req: express.Request, res: express.Response) => {
  try {
    const category = await categoryModel.find().populate('storeId').sort({ createdAt: -1 });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const getCategorybystoreid = async (req: express.Request, res: express.Response) => {
  try {
    const { storeId } = req.params;
    if (!storeId) {
      return res.status(400).json({ message: 'Store ID not found' });
    }
    const category = await categoryModel.find({ storeId }).sort({ createdAt: -1 });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const updateCategory = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    const category = await categoryModel.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const updateData: any = {};

    if (req.body.catname) {
      updateData.catname = req.body.catname;
    }

    if (req.file) {
      updateData.catimage = req.file.path.replace(/\\/g, "/");
    } else if (req.body.catimage) {
      updateData.catimage = req.body.catimage;
    }

    const updatedCategory = await categoryModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.status(200).json(updatedCategory);
    // console.log(updatedCategory)
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const deleteCategory = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Category ID is required' });
    }
    const deletedCategory = await categoryModel.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const getAdminCategories = async (req: express.Request, res: express.Response) => {
  try {
    // Import inside to avoid circular or early load issues if any
    const ProductModel = (await import('../model/productModel.js')).default;
    const OfferModel = (await import('../model/offerModel.js')).default;
    const CategoryModel = (await import('../model/categoryModel.js')).default;

    const categories = await CategoryModel.find()
      .populate({
        path: 'storeId',
        populate: {
          path: 'ownerId',
          select: 'name email'
        }
      })
      .sort({ createdAt: -1 });

    const categoriesWithDetails = await Promise.all(categories.map(async (cat: any) => {
      // Find products that match this category either by Name or by ID
      const productCount = await ProductModel.countDocuments({
        $or: [
          { category: cat.catname },
          { category: { $regex: new RegExp(`^${cat.catname}$`, 'i') } },
          { category: cat._id.toString() }
        ],
        storeId: cat.storeId?._id
      });

      const offers = await OfferModel.find({
        $or: [
          { category: cat.catname },
          { category: { $regex: new RegExp(`^${cat.catname}$`, 'i') } },
          { category: cat._id.toString() }
        ]
      });

      return {
        _id: cat._id,
        catname: cat.catname,
        catimage: cat.catimage,
        store: cat.storeId?.name || "Unknown Store",
        owner: cat.storeId?.ownerId?.name || "Unknown User",
        ownerEmail: cat.storeId?.ownerId?.email,
        productCount,
        offers: offers.map(o => ({
          title: o.title,
          discountPercentage: o.discountPercentage,
          startDate: o.startDate,
          endDate: o.endDate,
          isActive: o.isActive,
          createdAt: o.createdAt
        })),
        offerCount: offers.length,
        createdAt: cat.createdAt
      };
    }));

    res.status(200).json(categoriesWithDetails);
  } catch (error) {
    console.error('Error fetching admin categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
