import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// FALLBACK: Use environment variable OR hardcoded secret
const JWT_SECRET = process.env.JWT_SECRET || "my_super_secure_jwt_secret_key_12345";

// Verify JWT_SECRET is available
console.log("AUTH CONTROLLER: JWT_SECRET =", JWT_SECRET ? "✅ LOADED" : "❌ UNDEFINED");

/* REGISTER */
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Debug: Log what we received
        console.log("REGISTER REQUEST BODY:", JSON.stringify(req.body, null, 2));

        // Validate all required fields
        if (!name || !email || !password) {
            console.log("Missing fields:", { name: !!name, email: !!email, password: !!password });
            return res.status(400).json({
                message: "All fields required",
                received: { name: !!name, email: !!email, password: !!password }
            });
        }

        // Check if user already exists
        const exists = await User.findOne({ email: email.toLowerCase() });
        if (exists) {
            console.log("User already exists:", email);
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword
        });

        console.log("User created successfully:", user._id);

        // Generate JWT token using the guaranteed secret
        const token = jwt.sign(
            { userId: user._id },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Return success response
        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {
        console.error("REGISTER ERROR:", err);
        res.status(500).json({ message: "Server error: " + err.message });
    }
};

/* LOGIN */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Debug: Log what we received
        console.log("LOGIN REQUEST BODY:", JSON.stringify(req.body, null, 2));

        // Validate required fields
        if (!email || !password) {
            console.log("Missing login fields:", { email: !!email, password: !!password });
            return res.status(400).json({ message: "Email and password required" });
        }

        // Find user by email (case-insensitive)
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            console.log("User not found:", email);
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare passwords
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            console.log("Password mismatch for:", email);
            return res.status(400).json({ message: "Invalid credentials" });
        }

        console.log("User logged in successfully:", user._id);

        // Generate JWT token using the guaranteed secret
        const token = jwt.sign(
            { userId: user._id },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Return success response
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {
        console.error("LOGIN ERROR:", err);
        res.status(500).json({ message: "Server error: " + err.message });
    }
};

/* GET CURRENT USER */
export const me = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        console.log("ME endpoint called for user:", req.user._id);

        res.json({
            id: req.user._id,
            name: req.user.name,
            email: req.user.email
        });
    } catch (err) {
        console.error("ME ERROR:", err);
        res.status(500).json({ message: "Server error: " + err.message });
    }
};
