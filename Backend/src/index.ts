import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import logger from './logger.js';



import UserRouter from './router/User.js';
import storeRouter from './router/Store.js';
import productRouter from './router/Product.js';
import categoryRouter from './router/Category.js';
import PaymentRouter from './router/Payment.js';
import TemplateRouter from './router/template.js';
import orderRouter from './router/Order.js';
import offerRouter from './router/offer.js';



dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;


const MONGO_URL = process.env.MONGO_URL || '';

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

mongoose.connect(MONGO_URL)
  .then(() => {
    logger.info('✅ Connected to MongoDB successfully');
  })
  .catch((error) => {
    logger.error('❌ Error connecting to MongoDB', { error: error.message });
  });

app.use(storeRouter)
app.use(productRouter);
app.use("/uploads", express.static("uploads"));
app.use(UserRouter)
app.use(categoryRouter)
app.use(PaymentRouter)
app.use(TemplateRouter)
app.use(orderRouter)
app.use(offerRouter);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Server error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// 404 handler
app.use((req, res) => {
  logger.warn('Route not found', { path: req.path, method: req.method });
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  logger.info(`🚀 Server is running on http://localhost:${PORT}`, {
    port: PORT,
    env: process.env.NODE_ENV || 'development',
  });
});

