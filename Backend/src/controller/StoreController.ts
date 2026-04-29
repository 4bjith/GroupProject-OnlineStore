import express from 'express';
import Store from '../model/Store.js';
import fs from "fs";
import path from "path";

//  createStore handles the creation of a new store
export const createStore = async (req: express.Request, res: express.Response) => {
  // Implementation for creating a store
  try {
    const { ownerId, name, currency, templateId, templateSlug, commissionRate, logoUrl, themeSettings } = req.body;

    if (!ownerId || !name || !currency) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // FILE OR URL
    let logo: string | null = null;

    if (req.file) {
      logo = `/uploads/${req.file.filename}`; // static files are served from /uploads
    } else if (logoUrl) {
      logo = logoUrl;
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");


    let finalThemeSettings = themeSettings ? (typeof themeSettings === 'string' ? JSON.parse(themeSettings) : themeSettings) : null;
    
    // Fallback exactly to template defaults if not provided but template exists
    if (!finalThemeSettings && templateId) {
       const mongoose = await import('mongoose');
       const TemplateModel = mongoose.model('Template');
       const tpl = await TemplateModel.findById(templateId) as any;
       if (tpl && tpl.defaultThemeSettings) {
          finalThemeSettings = tpl.defaultThemeSettings;
       }
    }

    const store = new Store({ ownerId, name, slug, currency, templateId, templateSlug: templateSlug || 'template-001', commissionRate: Number(commissionRate), logo, themeSettings: finalThemeSettings });

    await store.save();
    res.status(201).json({ message: 'Store created successfully', store });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const getStore = async (req: express.Request, res: express.Response) => {
  // Implementation for retrieving a store by ID
  try {
    const storeId = req.params.id;
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.status(200).json(store);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const getStoreBySlug = async (req: express.Request, res: express.Response) => {
  // Implementation for retrieving a store by slug
  try {
    const slug = req.params.slug;
    if (!slug) {
      return res.status(400).json({ error: 'Slug is required' });
    }
    const store = await Store.findOne({ slug });
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.status(200).json(store);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const getAllStores = async (req: express.Request, res: express.Response) => {
  // Implementation for retrieving all stores
  try {
    const stores = await Store.find().populate("templateId");
    if (stores.length === 0) {
      return res.status(404).json({ error: 'No stores found' });
    }
    res.status(200).json(stores);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const updateStore = async (req: express.Request, res: express.Response) => {
  // Implementation for updating a store
  try {
    const storeId = req.params.id;

    console.log('=== UPDATE STORE START ===');
    console.log('UPDATE STORE - Store ID:', storeId);
    console.log('UPDATE STORE - Full req.body:', JSON.stringify(req.body, null, 2));
    console.log('UPDATE STORE - templateSlug from req.body:', req.body?.templateSlug);
    console.log('UPDATE STORE - themeSettings from req.body:', req.body?.themeSettings);
    console.log('UPDATE STORE - req.file:', req.file);

    const {
      ownerId,
      name,
      currency,
      templateId,
      templateSlug,
      commissionRate,
      isPublished,
      domain,
      logoUrl,
      status,
      themeSettings,
    } = req.body;

    console.log('UPDATE STORE - Extracted templateSlug:', templateSlug);
    console.log('UPDATE STORE - Extracted themeSettings:', themeSettings);

    const store = await Store.findById(storeId);
    if (!store) {
      console.log('UPDATE STORE - Store not found');
      return res.status(404).json({ error: "Store not found" });
    }
    console.log('UPDATE STORE - Found store:', store.name);

    // HANDLE LOGO UPDATE
    let logo = store.logo; // default → keep existing

    if (req.file) {
      // delete old local file if exists
      if (store.logo && store.logo.startsWith("/uploads")) {
        const oldPath = path.join(process.cwd(), store.logo);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      logo = `/uploads/${req.file.filename}`;
    } else if (logoUrl) {
      logo = logoUrl;
    }

    // UPDATE FIELDS
    if (ownerId) store.ownerId = ownerId;
    if (name) store.name = name;
    if (currency) store.currency = currency;
    if (templateId) store.templateId = templateId;
    if (templateSlug) store.templateSlug = templateSlug;
    console.log('UPDATE STORE - Setting store.templateSlug to:', store.templateSlug);
    if (commissionRate !== undefined) store.commissionRate = Number(commissionRate);
    if (isPublished !== undefined) store.isPublished = isPublished;
    if (status) store.status = status;
    if (domain !== undefined) store.domain = domain;
    if (logo) store.logo = logo;
    
    // Handle themeSettings update
    if (themeSettings !== undefined) {
      console.log('UPDATE STORE - Processing themeSettings');
      let parsedThemeSettings = themeSettings;
      
      // Parse if it's a string (from FormData)
      if (typeof themeSettings === 'string') {
        try {
          parsedThemeSettings = JSON.parse(themeSettings);
          console.log('UPDATE STORE - Parsed themeSettings from string:', parsedThemeSettings);
        } catch (e) {
          console.error('UPDATE STORE - Failed to parse themeSettings string:', e);
          return res.status(400).json({ error: 'Invalid themeSettings format' });
        }
      }
      
      // Ensure proper structure exists (validation at controller level)
      if (!parsedThemeSettings.colors) {
        parsedThemeSettings.colors = { primary: '#10b981', secondary: '#14b8a6', background: '#ffffff', text: '#111827' };
      }
      if (!parsedThemeSettings.fonts) {
        parsedThemeSettings.fonts = { primary: 'Inter' };
      }
      if (!parsedThemeSettings.content) {
        parsedThemeSettings.content = {
          hero: { title: '', subtitle: '', ctaText: 'Shop Now', image: '', alignment: 'center', height: '85vh' },
          features: { title: 'Why Choose Us', items: [] },
          banner: { headline: '', subtext: '', ctaText: 'Shop Now' },
          newsletter: { heading: 'Stay Updated', subtext: 'Subscribe to our newsletter', buttonText: 'Subscribe' },
          products: { title: 'Featured Products' }
        };
      }
      if (!parsedThemeSettings.blocks) {
        parsedThemeSettings.blocks = [];
      }
      
      store.themeSettings = parsedThemeSettings;
      console.log('UPDATE STORE - Set store.themeSettings:', store.themeSettings);
    }

    // update slug only if name changes
    if (name) {
      store.slug = name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
    }

    await store.save();
    console.log('UPDATE STORE - Saved store with templateSlug:', store.templateSlug);
    console.log('UPDATE STORE - Saved store.themeSettings:', store.themeSettings);

    res.status(200).json({
      message: "Store updated successfully",
      store,
    });
  } catch (error: any) {
    console.error("UPDATE STORE ERROR:", error);
    console.error("ERROR NAME:", error.name);
    console.error("ERROR MESSAGE:", error.message);
    console.error("ERROR STACK:", error.stack);
    if (error.errors) {
      console.error("VALIDATION ERRORS:", error.errors);
    }
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

export const deleteStore = async (req: express.Request, res: express.Response) => {
  try {
    const storeId = req.params.id;
    const store = await Store.findByIdAndDelete(storeId);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.status(200).json({ message: 'Store deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}