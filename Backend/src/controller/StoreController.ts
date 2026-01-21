import express from 'express';
import Store from '../model/Store.js';
import fs from "fs";
import path from "path";

//  createStore handles the creation of a new store
export const createStore = async (req: express.Request, res: express.Response) => {
  // Implementation for creating a store
  try {
    const { ownerId, name, currency, templateId, commissionRate, logoUrl } = req.body;

    if (!ownerId || !name || !currency || !templateId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // 🔑 FILE OR URL
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


    const store = new Store({ ownerId, name, slug, currency, templateId, commissionRate: Number(commissionRate), logo });

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

export const updateStore = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const storeId = req.params.id;

    const {
      ownerId,
      name,
      currency,
      templateId,
      commissionRate,
      isPublished,
      domain,
      logoUrl,
      status,
    } = req.body;

    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    // 🔑 HANDLE LOGO UPDATE
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

    // 🔑 UPDATE FIELDS
    store.ownerId = ownerId ?? store.ownerId;
    store.name = name ?? store.name;
    store.currency = currency ?? store.currency;
    store.templateId = templateId ?? store.templateId;
    store.commissionRate =
      commissionRate !== undefined
        ? Number(commissionRate)
        : store.commissionRate;
    store.isPublished =
      isPublished !== undefined ? isPublished : store.isPublished;
    store.status = status ?? store.status;
    store.domain = domain ?? store.domain;
    store.logo = logo;

    // update slug only if name changes
    if (name) {
      store.slug = name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
    }

    await store.save();

    res.status(200).json({
      message: "Store updated successfully",
      store,
    });
  } catch (error) {
    console.error("UPDATE STORE ERROR:", error);
    res.status(500).json({ error: "Internal Server Error" });
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