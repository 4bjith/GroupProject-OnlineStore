import jwt from "jsonwebtoken";
import express from "express";

export const LoginCheck = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { email: decoded.email };
        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Unauthorized" })

    }
}
