import express from 'express';
import ProductModel from '../model/productModel.js';
import logger from '../logger.js';

// api function to create a new product
// api function to create a new product
export const createProduct = async (req: express.Request, res: express.Response) => {
  try {
    let {
      storeId,
      title,
      description,
      category,
      price,
      compareAtPrice,
      stock,
      stockKeepingUnit,
      specifications,
      tags,
      imageUrls,
      market,
      isActive,
      isFinite,
    } = req.body;
    logger.info('Creating product', { storeId, title, category });

    // 1️⃣ Uploaded files
    const files = req.files as Express.Multer.File[] | undefined;
    const uploadedImages = files?.map(
      (file) => `/uploads/${file.filename}`
    ) || [];

    // 2️⃣ Parse JSON strings
    if (typeof specifications === "string") {
      specifications = JSON.parse(specifications);
    }

    if (typeof tags === "string") {
      tags = JSON.parse(tags);
    }

    if (typeof imageUrls === "string") {
      imageUrls = JSON.parse(imageUrls);
    }

    // 3️⃣ Merge images (uploaded + URLs)
    const finalImages = [
      ...uploadedImages,
      ...(Array.isArray(imageUrls) ? imageUrls : []),
    ];

    // 4️⃣ Validation
    if (!storeId || !title || !description || !category || !price || stock === undefined) {
      logger.warn('Product creation failed: Missing required fields', { storeId, title });
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // 5️⃣ Duplicate check
    const exists = await ProductModel.findOne({ storeId, title });
    if (exists) {
      logger.warn('Product creation failed: Duplicate product', { storeId, title });
      return res.status(409).json({
        success: false,
        message: "Product already exists in this store",
      });
    }

    // 6️⃣ Create product
    const product = new ProductModel({
      storeId,
      title,
      description,
      category,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      stock: Number(stock),
      stockKeepingUnit,
      images: finalImages,
      specifications: specifications || [],
      tags: tags || [],
      market,
      isActive: isActive ?? true,
      isFinite: isFinite ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await product.save();
    logger.info('Product created successfully', { productId: product._id, storeId, title });
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });

  } catch (error: any) {
    logger.error('Product creation error', { error: error.message, stack: error.stack });
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// api function to get a product by ID (not implemented yet)
export const getProductById = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    logger.info('Fetching product by ID', { productId: id });
    if (!id) {
      logger.warn('Get product failed: ID missing');
      return res.status(400).json({ message: 'Product ID is required' });
    }
    const product = await ProductModel.findById(id).populate('storeId');
    if (!product) {
      logger.warn('Get product failed: Product not found', { productId: id });
      return res.status(404).json({ message: 'Product not found' });
    }
    logger.info('Product fetched successfully', { productId: id, title: product.title });
    res.status(200).json(product);
  } catch (error) {
    logger.error('Get product error', { error: error instanceof Error ? error.message : 'Unknown error' });
    res.status(500).json({ message: 'Internal server error' });
  }
}

// api function to fetch all products by store ID (not implemented yet)
export const getAllProducts = async (req: express.Request, res: express.Response) => {
  try {
    const storeId = req.query.storeId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const search = req.query.search as string || "";
    const skip = (page - 1) * limit;
    logger.info('Fetching products', { storeId, page, limit, search });

    const query: any = {};
    if (storeId) {
      query.storeId = storeId;
    }
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const [products, total] = await Promise.all([
      ProductModel.find(query)
        .populate("storeId")
        .skip(skip)
        .limit(limit)
        .lean(),
      ProductModel.countDocuments(query)
    ]);

    logger.info('Products fetched successfully', { count: products.length, total, page });
    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: products,
    });

  } catch (error) {
    logger.error('Fetch products error', { error: error instanceof Error ? error.message : 'Unknown error' });
    res.status(500).json({ message: "Internal server error" });
  }
};


// api function to update a product by ID (not implemented yet)
// api function to update a product by ID
export const updateProductById = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    logger.info('Updating product', { productId: id });
    if (!id) {
      logger.warn('Update product failed: ID missing');
      return res.status(400).json({ message: 'Product ID is required' });
    }

    let {
      title,
      description,
      category,
      price,
      compareAtPrice,
      stock,
      stockKeepingUnit,
      specifications,
      tags,
      market,
      isActive,
      isFinite,
      imageUrls,
      status
    } = req.body;

    // 1️⃣ Uploaded files
    const files = req.files as Express.Multer.File[] | undefined;
    const uploadedImages = files?.map(
      (file) => `/uploads/${file.filename}`
    ) || [];

    // 2️⃣ Parse JSON strings (FormData sends objects as strings)
    if (typeof specifications === "string") try { specifications = JSON.parse(specifications); } catch (e) { }
    if (typeof tags === "string") try { tags = JSON.parse(tags); } catch (e) { }
    if (typeof imageUrls === "string") try { imageUrls = JSON.parse(imageUrls); } catch (e) { imageUrls = [imageUrls]; }
    if (typeof isActive === "string") isActive = isActive === "true";
    if (typeof isFinite === "string") isFinite = isFinite === "true";

    // 3️⃣ Merge images (uploaded + preserved/manual URLs)
    // We expect the frontend to send `imageUrls` for the images that remain, 
    // and `images` (files) for new ones.
    const finalImages = [
      ...uploadedImages,
      ...(Array.isArray(imageUrls) ? imageUrls : []),
    ];

    const updatedProduct = await ProductModel.findByIdAndUpdate(id, {
      title,
      description,
      category,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      images: finalImages.length > 0 ? finalImages : undefined, // care: if empty, might want to clear? Assuming frontend sends all kept images.
      stock: Number(stock),
      stockKeepingUnit,
      specifications,
      tags,
      market,
      isActive,
      status,
      isFinite,
      updatedAt: new Date()
    }, { new: true });

    if (!updatedProduct) {
      logger.warn('Update product failed: Product not found', { productId: id });
      return res.status(404).json({ message: 'Product not found' });
    }
    logger.info('Product updated successfully', { productId: id, title: updatedProduct.title });
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct
    });
  } catch (error: any) {
    logger.error('Update product error', { error: error.message, productId: req.params.id });
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

// api function to delete a product by ID (not implemented yet)
export const deleteProductById = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    logger.info('Deleting product', { productId: id });
    if (!id) {
      logger.warn('Delete product failed: ID missing');
      return res.status(400).json({ message: 'Product ID is required' });
    }
    const deletedProduct = await ProductModel.findByIdAndDelete(id);
    if (!deletedProduct) {
      logger.warn('Delete product failed: Product not found', { productId: id });
      return res.status(404).json({ message: 'Product not found' });
    }
    logger.info('Product deleted successfully', { productId: id, title: deletedProduct.title });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    logger.error('Delete product error', { error: error instanceof Error ? error.message : 'Unknown error', productId: req.params.id });
    res.status(500).json({ message: 'Internal server error' });
  }
}