import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import storeRouter from './router/Store.js';
import productRouter from './router/Product.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || '';

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

  app.use(storeRouter)
  app.use(productRouter);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

