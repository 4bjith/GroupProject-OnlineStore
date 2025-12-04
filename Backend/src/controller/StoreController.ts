import express from 'express';
import Store from '../model/Store.js';

//  createStore handles the creation of a new store
export const createStore =async (req: express.Request, res: express.Response) => {
    // Implementation for creating a store
    try {
        const { ownerId, name, currency, templateId, commissionRate } = req.body as {
            ownerId: string;
            name: string;
            currency: string;
            templateId: string;
            commissionRate: number;
        };
        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const store = new Store({ ownerId, name, slug, currency, templateId, commissionRate });
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
        const stores = await Store.find();
        if (stores.length === 0) {
            return res.status(404).json({ error: 'No stores found' });
        }
        res.status(200).json(stores);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const updateStore = async (req: express.Request, res: express.Response) => {

    try {
        const storeId = req.params.id;
         const { ownerId, name, slug, currency, templateId, commissionRate, isPublished, domain } = req.body as {
            ownerId: string;
            name: string;   
            slug: string;
            currency: string;
            templateId: string;
            commissionRate: number;
            isPublished: boolean;
            domain: string;
        };
        const store = await Store.findByIdAndUpdate(storeId, { ownerId, name, slug, currency, templateId, commissionRate, isPublished, domain }, { new: true });
        if (!store) {
            return res.status(404).json({ error: 'Store not found' });
        }
        res.status(200).json(store);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

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