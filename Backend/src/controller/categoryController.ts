import express from 'express';
import categoryModel from '../model/categoryModel.js';

export const createCategory = async (req: express.Request, res: express.Response) => {
    try {
        const { categoryname } = req.body;
        let categoryimage = req.body.categoryimage;

        if (req.file) {
            categoryimage = req.file.path.replace(/\\/g, "/"); // Normalize windows path
        }

        if (!categoryname || !categoryimage) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newcategory = await categoryModel.create({ categoryname, categoryimage });
        if (!newcategory) {
            return res.status(400).json({ message: 'Failed to create category' });
        }
        res.status(201).json(newcategory);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getAllCategories = async (req: express.Request, res: express.Response) => {
    try {
        const category = await categoryModel.find().sort({ createdAt: -1 });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const updateCategory = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Category ID is required' });
        }

        const { categoryname } = req.body;
        let categoryimage = req.body.categoryimage;

        if (req.file) {
            categoryimage = req.file.path.replace(/\\/g, "/");
        }

        const updatedCategory = await categoryModel.findByIdAndUpdate(id, { categoryname, categoryimage }, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(updatedCategory);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

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
