import express from 'express';
import ProductModel from '../model/productModel.js';

// api function to create a new product
export const createProduct =async (req: express.Request, res: express.Response) => {
  try {
    const {storeId, name, description, category, price, stock } = req.body as {
      storeId: string;
      name: string;
        description: string;
        category: string;
        price: number;
        stock: number;
    };

    if (!storeId || !name || !description || !category || price === undefined || stock === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }   
    const Product = await ProductModel.create({
      storeId,
      name,
      description,
      category,
      price,
      stock
    });
    if (!Product) {
      return  res.status(400).json({ message: 'Failed to create product' });
    }
    res.status(201).json(Product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Internal server error' });
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
    const { storeId} = req.params;
    if (!storeId) {
      return res.status(400).json({ message: 'Store ID is required' });
    }
    const products = await ProductModel.find({ storeId }).populate('storeId');
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// api function to update a product by ID (not implemented yet)
export const updateProductById = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Product ID is required' });
        }
        const { name, description, category, price, stock } = req.body;
        const updatedProduct = await ProductModel.findByIdAndUpdate({ id }, {
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