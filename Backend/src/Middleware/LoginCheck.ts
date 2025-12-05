import jwt, { type JwtPayload } from "jsonwebtoken";
import express from "express";
import dotenv from "dotenv";
// dotenv.config();

export const LoginCheck = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string);
        if (typeof decoded === 'string') {
            return res.status(403).json({ message: "Invalid Token" });
        }
        req.user = { email: decoded.email };
        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Unauthorized" })

    }
}
