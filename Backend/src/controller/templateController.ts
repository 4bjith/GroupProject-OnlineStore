import express from 'express';
import Template from '../model/templateModel.js';
import { getSectionDefinition, validateSectionData, getSectionDefaults } from '../lib/sectionRegistry.js';

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
      defaultThemeSettings,
      pages,
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

    // Parse defaultThemeSettings if it's a string (backward compatibility)
    let parsedThemeSettings = null;
    if (defaultThemeSettings) {
      parsedThemeSettings = typeof defaultThemeSettings === 'string' ? JSON.parse(defaultThemeSettings) : defaultThemeSettings;
    }

    // Parse pages if provided (new structure)
    let parsedPages = null;
    if (pages) {
      parsedPages = typeof pages === 'string' ? JSON.parse(pages) : pages;
    }

    // If no pages provided but defaultThemeSettings has blocks, convert to new structure for backward compatibility
    let finalPages = parsedPages;
    if (!finalPages && parsedThemeSettings?.blocks) {
      // Map old block types to new section types
      const typeMapping: Record<string, string> = {
        'hero': 'hero',
        'features': 'features',
        'products': 'productGrid',
        'newsletter': 'newsletter',
      };
      
      finalPages = [{
        id: 'page-1',
        name: 'Home',
        slug: 'home',
        isDefault: true,
        sections: parsedThemeSettings.blocks.map((block: any, index: number) => ({
          id: block.id || `section-${index}`,
          type: typeMapping[block.type] || block.type,
          props: block.config || {},
          styles: {},
          order: index,
          isVisible: true,
        })),
      }];
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
      defaultThemeSettings: parsedThemeSettings,
      pages: finalPages || [],
      version: 1,
      isPublished: false,
      isBaseTemplate: true,
    });

    await newTemplate.save();

    res.status(201).json({
      message: "Template created successfully",
      template: newTemplate,
    });
  } catch (error) {
    console.error("Create Template Error:", error);
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : String(error) });
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
    const { name, description, content, primaryColor, secondaryColor, defaultThemeSettings, pages } = req.body;

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
        defaultThemeSettings: defaultThemeSettings ? (typeof defaultThemeSettings === 'string' ? JSON.parse(defaultThemeSettings) : defaultThemeSettings) : undefined,
        pages: pages || undefined,
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

// Duplicate template for merchant customization
export const duplicateTemplate = async (req: express.Request, res: express.Response) => {
  try {
    const { slug } = req.params as { slug: string };
    const { customName, ownerId } = req.body;

    const originalTemplate = await Template.findOne({ slug });
    if (!originalTemplate) {
      return res.status(404).json({ message: "Template not found" });
    }

    // Create a copy with new slug and parent reference
    const newSlug = `${slug}-${Date.now()}`;
    const duplicatedTemplate = new Template({
      name: customName || `${originalTemplate.name} (Custom)`,
      slug: newSlug,
      description: originalTemplate.description,
      previewImage: originalTemplate.previewImage,
      primaryColor: originalTemplate.primaryColor,
      secondaryColor: originalTemplate.secondaryColor,
      author: ownerId || 'merchant',
      version: 1,
      isPublished: false,
      isBaseTemplate: false,
      parentTemplateId: originalTemplate._id,
      pages: originalTemplate.pages,
      defaultThemeSettings: originalTemplate.defaultThemeSettings,
    });

    await duplicatedTemplate.save();

    res.status(201).json({
      message: "Template duplicated successfully",
      template: duplicatedTemplate,
    });
  } catch (error) {
    console.error("Duplicate Template Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Generate preview (no save)
export const generatePreview = async (req: express.Request, res: express.Response) => {
  try {
    const { slug } = req.params as { slug: string };
    const template = await Template.findOne({ slug });

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    // Return template data without saving
    res.status(200).json({
      template,
      preview: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get available section types
export const getSectionTypes = async (req: express.Request, res: express.Response) => {
  try {
    const sections: any = {};
    const { SectionRegistry } = require('../lib/sectionRegistry');
    
    for (const [key, value] of Object.entries(SectionRegistry) as [string, any][]) {
      sections[key] = {
        label: value.label,
        category: value.category,
        description: value.description,
        defaultProps: value.defaultProps,
        editableFields: value.editableFields,
        allowedStyles: value.allowedStyles,
        apiBinding: value.apiBinding || false,
      };
    }

    res.status(200).json({ sections });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Publish template (increment version)
export const publishTemplate = async (req: express.Request, res: express.Response) => {
  try {
    const { slug } = req.params as { slug: string };
    
    const template = await Template.findOne({ slug });
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    // Increment version and mark as published
    template.version += 1;
    template.isPublished = true;
    template.updatedAt = new Date();

    await template.save();

    res.status(200).json({
      message: "Template published successfully",
      template,
    });
  } catch (error) {
    console.error("Publish Template Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get template by version
export const getTemplateByVersion = async (req: express.Request, res: express.Response) => {
  try {
    const { slug } = req.params as { slug: string };
    const { version } = req.query as { version?: string };

    const template = await Template.findOne({ slug });
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    // For now, return current template (version history would require separate collection)
    // In a full implementation, you'd have a TemplateVersion collection
    if (version && parseInt(version) !== template.version) {
      return res.status(404).json({ message: "Version not found in history" });
    }

    res.status(200).json({ template });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Validate template structure
export const validateTemplate = async (req: express.Request, res: express.Response) => {
  try {
    const { template } = req.body;

    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if template has required fields
    if (!template.name) {
      errors.push("Template name is required");
    }

    if (!template.pages || template.pages.length === 0) {
      errors.push("Template must have at least one page");
    }

    // Validate each page
    if (template.pages) {
      template.pages.forEach((page: any, pageIndex: number) => {
        if (!page.name) {
          errors.push(`Page ${pageIndex + 1}: Name is required`);
        }
        if (!page.slug) {
          errors.push(`Page ${pageIndex + 1}: Slug is required`);
        }

        // Validate sections
        if (page.sections) {
          page.sections.forEach((section: any, sectionIndex: number) => {
            const sectionDef = getSectionDefinition(section.type);
            if (!sectionDef) {
              errors.push(`Page ${pageIndex + 1}, Section ${sectionIndex + 1}: Unknown section type '${section.type}'`);
            } else {
              // Validate section data
              const validation = validateSectionData(section.type, section.props || {});
              if (!validation.valid) {
                errors.push(...validation.errors.map(e => `Page ${pageIndex + 1}, Section ${sectionIndex + 1}: ${e}`));
              }
            }
          });
        }
      });
    }

    // Check for required sections (at least one hero section recommended)
    const hasHero = template.pages?.some((page: any) => 
      page.sections?.some((section: any) => section.type === 'hero')
    );
    if (!hasHero) {
      warnings.push("Template should have at least one Hero section for better UX");
    }

    res.status(200).json({
      valid: errors.length === 0,
      errors,
      warnings,
    });
  } catch (error) {
    console.error("Validate Template Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
