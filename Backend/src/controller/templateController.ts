import express from 'express';
import Template from '../model/templateModel.js';

// Create controller function for creating a new template
// CREATE TEMPLATE
export const createTemplate = async (req: express.Request, res: express.Response) => {
  try {
    const {
      name,
      description,
      content,
      primaryColor,
      secondaryColor,
      author,
    } = req.body;

    // Basic validation
    if (!name) {
      return res.status(400).json({ message: "Template name is required" });
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    // Check duplicate slug
    const existingTemplate = await Template.findOne({ slug });
    if (existingTemplate) {
      return res
        .status(400)
        .json({ message: "Template with this name already exists" });
    }

    // Handle image from multer
    let previewImage = null;
    if (req.file) {
      previewImage = `/uploads/${req.file.filename}`; // or req.file.filename
    }

    const newTemplate = new Template({
      name,
      slug,
      description,
      content,
      previewImage,
      primaryColor,
      secondaryColor,
      author,
    });

    await newTemplate.save();

    res.status(201).json({
      message: "Template created successfully",
      template: newTemplate,
    });
  } catch (error) {
    console.error("Create Template Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create controller function for fetching all templates
export const getAllTemplates = async (req: express.Request, res: express.Response) => {
    try {
        const templates = await Template.find(); // Fetch all templates from the database
        if (templates.length === 0) {
            return res.status(404).json({ message: 'No templates found' }); // Return not found if no templates exist
        }
        res.status(200).json({ templates }); // Return the list of templates

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Create controller function for fetching a template by slug
export const getTemplateBySlug = async (req: express.Request, res: express.Response) => {
    try {
        const { slug } = req.params as { slug: string };
        const template = await Template.findOne({ slug }); // Fetch template by slug from the database

        if (!template) {
            return res.status(404).json({ message: 'Template not found' }); // Return not found if template does not exist
        }
        res.status(200).json({ template }); // Return the found template
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Create controller function for deleting a template by slug
export const deleteTemplateBySlug = async (req: express.Request, res: express.Response) => {
    try {
        const { slug } = req.params as { slug: string };
        const deletedTemplate = await Template.findOneAndDelete({ slug }); // Delete template by slug from the database     
        if (!deletedTemplate) {
            return res.status(404).json({ message: 'Template not found' }); // Return not found if template does not exist
        }
        res.status(200).json({ message: 'Template deleted successfully' }); // Return success response
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Create controller function for updating a template by slug
export const updateTemplateBySlug = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { slug } = req.params as { slug: string };
    const { name, description, content, primaryColor, secondaryColor } = req.body;

    console.log(primaryColor, secondaryColor);

    let previewImage = req.body.previewImage; // ✅ mutable variable

    const file = req.file; // multer file
    if (file) {
      previewImage = `/uploads/${file.filename}`;
    }

    const newSlug = name
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');

    const updatedTemplate = await Template.findOneAndUpdate(
      { slug },
      {
        name,
        slug: newSlug,
        description,
        content,
        previewImage,
        primaryColor,
        secondaryColor,
      },
      { new: true }
    );

    if (!updatedTemplate) {
      return res.status(404).json({ message: "Template not found" });
    }

    res.status(200).json({
      message: "Template updated successfully",
      template: updatedTemplate,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
