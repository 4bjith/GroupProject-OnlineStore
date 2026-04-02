import jwt from "jsonwebtoken";
import express from "express";
import dotenv from "dotenv";
import UserModel from "../model/User.js";
import crypto from "crypto";
dotenv.config();

export const LoginCheck = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        // 1. Get token from cookies or Authorization header
        let token = req.cookies.token;

        if (!token) {
            const authHeader = req.headers['authorization'];
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
            }
        }

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
        
        if (!decoded || !decoded.email) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        // 3. Check if token is blacklisted
        const user = await UserModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        // Hash the current token to check against blacklist
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        
        if (user.blacklistedTokens.includes(hashedToken)) {
            return res.status(401).json({ message: "Unauthorized: Token is blacklisted" });
        }

        // 4. Attach user info to request
        req.user = { 
            id: decoded.id,
            email: decoded.email,
            role: decoded.role 
        };
        
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(401).json({ message: "Unauthorized: Access denied" });
    }
};
