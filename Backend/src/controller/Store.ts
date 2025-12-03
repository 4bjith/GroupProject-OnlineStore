import express from 'express';
import Store from '../model/Store.js';
export const createStore =async (req: express.Request, res: express.Response) => {
    // Implementation for creating a store
    try {
        const { ownerId, name, slug, currency, template } = req.body as {
            ownerId: string;
            name: string;
            slug: string;
            currency: string;
            template: string;
        };
        const store = new Store({ ownerId, name, slug, currency, template });
        await store.save();
        res.status(201).json({ message: 'Store created successfully', store });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}