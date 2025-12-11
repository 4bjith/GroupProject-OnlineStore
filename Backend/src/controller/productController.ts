import express from 'express';
import ProductModel from '../model/productModel.js';

// api function to create a new product
export const createProduct =async (req: express.Request, res: express.Response) => {
 try {
    const {
      storeId,
      title,
      description,
      category,
      price,
      compareAtPrice,
      images,
      stock,
      stockKeepingUnit,
      specifications,
      tags,
      market,
      isActive,
      isFinite,
    } = req.body as {
      storeId: string;
      title: string;
      description: string;
      category: string;
      price: number;
      compareAtPrice?: number;
      images?: string[];
      stock: number;
      stockKeepingUnit?: string;
      specifications?: { key: string; value: string }[];
      tags?: string[];
      market?: string;
      isActive?: boolean;
      isFinite?: boolean;
    };

    // Basic Validation
    if ( !storeId || !title || !description || !category || !price || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "storeId, title, description, category, price, and stock are required.",
      });
    }

    // Optional: prevent duplicate product in same store
    const existing = await ProductModel.findOne({ storeId, title });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "A product with this title already exists in this store.",
      });
    }

    const newProduct = new ProductModel({
      storeId,
      title,
      description,
      category,
      price,
      compareAtPrice,
      images: images || [],
      stock,
      stockKeepingUnit,
      specifications: specifications || [],
      tags: tags || [],
      market,
      isActive: isActive !== undefined ? isActive : true,
      isFinite: isFinite !== undefined ? isFinite : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newProduct.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: newProduct,
    });
  } catch (error: any) {
    console.error("CREATE PRODUCT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the product.",
      error: error.message || "Unknown error",
    });
  }
}


// api function to get a product by ID (not implemented yet)
export const getProductById = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    const product = await ProductModel.findById(id).populate('storeId');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error getting product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// api function to fetch all products by store ID (not implemented yet)
export const getAllProducts = async (req: express.Request, res: express.Response) => {
  try {
    const storeId = req.query.storeId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;

    if (!storeId) {
      return res.status(400).json({ message: "Store ID is required" });
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      ProductModel.find({ storeId })
        .populate("storeId")
        .skip(skip)
        .limit(limit)
        .lean(),
      ProductModel.countDocuments({ storeId })
    ]);

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: products,
    });

  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// api function to update a product by ID (not implemented yet)
export const updateProductById = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Product ID is required' });
        }
        const { name, description, category, price, stock } = req.body;
        const updatedProduct = await ProductModel.findByIdAndUpdate(id, {
            name,
            description,
            category,
            price,
            stock
        }, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// api function to delete a product by ID (not implemented yet)
export const deleteProductById = async (req: express.Request, res: express.Response) => {
    try {  
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Product ID is required' });
        }
        const deletedProduct = await ProductModel.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}