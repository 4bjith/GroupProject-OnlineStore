import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';


import UserRouter from './router/User.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;


app.use(express.json())
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use(UserRouter)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

