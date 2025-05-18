import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.schema.js";

dotenv.config();

const authmiddleware = (userRole) => async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                status: false,
                message: "Authorization token missing",
            });
        }

        const token = authHeader.split(" ")[1];

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({
                status: false,
                message: "Invalid or expired token",
            });
        }

        const user = await User.findById(decoded._id).select("-password");

        if (!user) {
            return res.status(401).json({
                status: false,
                message: "User not found",
            });
        }

        // if (userRole && user.role !== userRole) {
        //     return res.status(403).json({
        //         status: false,
        //         message: "Access denied",
        //     });
        // }

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Internal server error",
        });
    }
};

export default authmiddleware;
