import jwt from "jsonwebtoken";
import express from "express";
import UserModel from "../model/User.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import logger from "../logger.js";
dotenv.config();


export const registerUser = async (req: express.Request, res: express.Response) => {
    try {
        const { name, email, password, number, role } = req.body as { name: string; email: string; password: string; number: string; role: string; };
        logger.info('User registration attempt', { email, role });
        if (!name || !email || !password || !number) {
            logger.warn('Registration failed: Missing fields', { email });
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await UserModel.findOne({ email });
        if (user) {
            logger.warn('Registration failed: User already exists', { email });
            return res.status(400).json({ message: "User already exists" });
        }
        const newUser = await UserModel.create({ name, email, password, number, role });
        logger.info('User registered successfully', { userId: newUser._id, email, role });
        return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        logger.error('Registration error', { error: error instanceof Error ? error.message : 'Unknown error' });
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const loginUser = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };
    logger.info('Login attempt', { email });
    if (!email || !password) {
      logger.warn('Login failed: Missing credentials');
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      logger.warn('Login failed: User not found', { email });
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn('Login failed: Invalid credentials', { email });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Include role in token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role, // 👈 IMPORTANT
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }
    );

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    logger.info('User logged in successfully', { userId: user._id, email, role: user.role });
    return res.status(200).json({
      token,
      role: user.role, // 👈 Send role to frontend
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    logger.error('Login error', { error: error instanceof Error ? error.message : 'Unknown error' });
    return res.status(500).json({ message: "Internal server error" });
  }
};



export const getUserDetails = async (req: express.Request, res: express.Response) => {
    try {
        const { email } = req.user as jwt.JwtPayload;
        logger.info('Fetching user details', { email });
        if (!email) {
            logger.warn('Get user details failed: Email missing from token');
            return res.status(400).json({ message: "Email is required" });
        }
        const user = await UserModel.findOne({ email });
        if (!user) {
            logger.warn('Get user details failed: User not found', { email });
            return res.status(400).json({ message: "User not found" });
        }
        logger.info('User details fetched successfully', { userId: user._id, email });
        return res.status(200).json({ user });
    } catch (error) {
        logger.error('Get user details error', { error: error instanceof Error ? error.message : 'Unknown error' });
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        logger.info('Fetching all users');
        const users = await UserModel.find();
        logger.info('All users fetched successfully', { count: users.length });
        return res.status(200).json({ users });
    } catch (error) {
        logger.error('Get all users error', { error: error instanceof Error ? error.message : 'Unknown error' });
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const updateUserDetails = async (req: express.Request, res: express.Response) => {
    try {
        const { email, name, number, address, businessType, businessDescription } = req.body as {
            email: string;
            name: string;
            number: string;
            address: string;
            businessType: string;
            businessDescription: string;
        };
        const file = req.file; // Multer adds this if file is uploaded
        logger.info('Updating user details', { email, hasFile: !!file });
        if (!email) {
            logger.warn('Update user failed: Email required');
            return res.status(400).json({ message: "Email is required" });
        }
        const user = await UserModel.findOne({ email: req.user?.email }); // req.user is added by the LoginCheck middleware
        if (!user) {
            logger.warn('Update user failed: User not found', { email });
            return res.status(400).json({ message: "User not found" });
        }
        if (number) user.number = number;
        if (name) user.name = name;
        if (address) user.address = address;
        if (businessType) user.businessType = businessType as any;
        if (businessDescription) user.businessDescription = businessDescription;
        if (file) {
            // Save relative or public path to the image
            user.profilePic = `/uploads/${file.filename}`;
        }
        await user.save();
        logger.info('User updated successfully', { userId: user._id, email });
        return res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        logger.error('Update user error', { error: error instanceof Error ? error.message : 'Unknown error' });
        return res.status(500).json({ message: "Internal server error" });
    }
};
