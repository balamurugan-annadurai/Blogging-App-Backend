import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./../models/user.schema.js";
import jwt from "jsonwebtoken"

dotenv.config();

export const signup = async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({
            status: false,
            message: "All fields (name, email, password) are required.",
        });
    }

    try {
        const existingUser = await User.findOne({
            $or: [{ email }, { name }]
        });

        if (existingUser) {
            const isEmailTaken = existingUser.email === email;
            const isNameTaken = existingUser.name === name;

            return res.status(400).json({
                status: false,
                message: isEmailTaken
                    ? "Email already registered."
                    : "Username already taken.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            status: true,
            message: "User registered successfully.",
        });

    } catch (error) {
        console.error("Signup error:", error);

        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                status: false,
                message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`,
            });
        }

        return res.status(500).json({
            status: false,
            message: "Internal server error. Please try again later.",
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            status: false,
            message: "Email and password are required",
        });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                status: false,
                message: "User not found",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                status: false,
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            { _id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            status: true,
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            status: false,
            message: "Server error. Please try again later.",
        });
    }
};

export const verifyUser = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "User is verified",
            user,
        });
    } catch (error) {
        console.error("User verification error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};