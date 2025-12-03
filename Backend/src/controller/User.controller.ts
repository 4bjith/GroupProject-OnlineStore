import jwt from "jsonwebtoken";
import express from "express";
import UserModel from "../model/User.js";
import bcrypt from "bcrypt";


export const registerUser = async (req: express.Request, res: express.Response) => {
    try {
        const { name, email, password, number } = req.body;
        if (!name || !email || !password || !number) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const newUser = await UserModel.create({ name, email, password, number });
        return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const loginUser = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const getUserDetails = async (req: express.Request, res: express.Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const updateUserDetails = async (req: express.Request, res: express.Response) => {
    try {
        const { email, name, number, } = req.body;
        const file = req.file; // Multer adds this if file is uploaded
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const user = await UserModel.findOne({ email: req.user.email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        if (number) user.number = number;
        if (name) user.name = name;
        if (file) {
            // Save relative or public path to the image
            user.profilePic = `/uploads/${file.filename}`;
        }
        await user.save();
        return res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
