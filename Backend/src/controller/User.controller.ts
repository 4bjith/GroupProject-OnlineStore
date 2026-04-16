import jwt from "jsonwebtoken";
import express from "express";
import UserModel from "../model/User.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import crypto from "crypto";
import logger from "../logger.js";
dotenv.config();

const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};

const validatePassword = (password: string) => {
    // Character, number, and symbol
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/-]).{6,}$/;
    return regex.test(password);
};


export const registerUser = async (req: express.Request, res: express.Response) => {
    try {
        const { name, email, password, confirmPassword, number, role } = req.body;
        logger.info('User registration attempt', { email, role });

        if (!name) return res.status(400).json({ message: "Name is required" });
        if (!email) return res.status(400).json({ message: "Email is required" });
        if (!validateEmail(email)) return res.status(400).json({ message: "Invalid email format" });
        if (!number) return res.status(400).json({ message: "Number is required" });
        if (!password) return res.status(400).json({ message: "Password is required" });
        if (!validatePassword(password)) return res.status(400).json({ message: "Password must contain at least one letter, one number, and one special character" });
        if (password !== confirmPassword) return res.status(400).json({ message: "Passwords do not match" });

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            logger.warn('Registration failed: User already exists', { email });
            return res.status(400).json({ message: "Email already in use" });
        }

        const newUser = await UserModel.create({
            name,
            email,
            password,
            number,
            role: role || "merchant",
            isVerified: false,
            createdAt: new Date()
        });

        logger.info('User registered successfully', { userId: newUser._id, email, role });
        return res.status(201).json({ message: "User registered successfully", user: { id: newUser._id, email: newUser.email } });
    } catch (error) {
        logger.error('Registration error', { error: error instanceof Error ? error.message : 'Unknown error' });
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const loginUser = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    logger.info('Login attempt', { email });

    if (!email || !password) {
      logger.warn('Login failed: Missing credentials');
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      logger.warn('Login failed: User not found', { email });
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isLoggedIn) {
        return res.status(400).json({ message: "User already logged in from another device" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn('Login failed: Invalid credentials', { email });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "48h" }
    );

    // Hash the token before storing? Or just store it. User said "token should be hashed" in context of blacklisting maybe.
    // But usually we just store the token or its hash. 
    // I'll hash it for blacklisting later.

    user.lastLogin = new Date();
    user.isLoggedIn = true;
    user.accountStatus = "Active"; // Assuming active on login
    await user.save();

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 48 * 60 * 60 * 1000, // 48 hours
        sameSite: "strict"
    });

    logger.info('User logged in successfully', { userId: user._id, email, role: user.role });
    return res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        verified: user.isVerified
      },
      loginDetails: {
          lastLogin: user.lastLogin,
          accountStatus: user.accountStatus,
          isVerified: user.isVerified
      }
    });
  } catch (error) {
    logger.error('Login error', { error: error instanceof Error ? error.message : 'Unknown error' });
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logoutUser = async (req: express.Request, res: express.Response) => {
    try {
        if (!req.user?.email) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = await UserModel.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Get token from cookie or header
        const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
        
        if (token) {
            // Hash the token before blacklisting
            const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
            user.blacklistedTokens.push(hashedToken);
        }

        user.isLoggedIn = false;
        await user.save();

        res.clearCookie("token");
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



export const getUserDetails = async (req: express.Request, res: express.Response) => {
    try {
        const email = req.user?.email;
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
        if (!req.user?.email) {
            return res.status(401).json({ message: "Unauthorized: Log in first" });
        }
        const user = await UserModel.findOne({ email: req.user.email });
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
