import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res, next) => {
    // Fetch data from req->body
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch (error) {
        console.log("Error in finding user:", error);
        return res.status(500).json({
            message: "Error occurred while checking for the user"
        });
    }

    if (!existingUser) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    // Compare password (async version for better performance)
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordCorrect) {
        return res.status(400).json({
            message: "Incorrect password"
        });
    }

    // Generate JWT token
    if (!process.env.JWT_SECRET_KEY) {
        return res.status(500).json({
            message: "Internal server error: JWT_SECRET not defined"
        });
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '30d' });

    return res.status(200).json({
        message: "Logged in successfully",
        user: {
            id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email
        },
        token
    });
};
