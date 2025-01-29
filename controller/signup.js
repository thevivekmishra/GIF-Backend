import User from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email ID"
            });
        }

        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        // Save user to database
        const savedUser = await newUser.save();

        // Generate JWT token
        let token;
        try {
            token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '30d' });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error generating token"
            });
        }

        // Respond with success
        console.log("User added successfully..", savedUser);
        return res.status(201).json({
            success: true,
            message: "User added successfully",
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email
            },
            token
        });

    } catch (error) {
        console.log("Something went wrong while adding the user", error);
        return res.status(500).json({
            success: false,
            message: "Failed to add user"
        });
    }
};
