import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// SIGNUP ENDPOINT
router.post("/signup", async (req, res) => {
    try {
        const { email, password, firstName, lastName, username } = req.body;

        // Validate input
        if (!email || !password || !firstName || !lastName || !username) {
            return res.status(400).json({ 
                error: "All fields are required: email, password, firstName, lastName, username" 
            });
        }

        // Check if user already exists by email
        const existingUserByEmail = await prisma.User.findUnique({
            where: { email }
        });

        if (existingUserByEmail) {
            return res.status(400).json({ 
                error: "User with this email already exists" 
            });
        }

        // Check if username already exists
        const existingUserByUsername = await prisma.User.findUnique({
            where: { username }
        });

        if (existingUserByUsername) {
            return res.status(400).json({ 
                error: "Username already taken" 
            });
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create user in database
        const newUser = await prisma.User.create({
            data: {
                email,
                username,
                passwordHash,
                firstName,
                lastName
            }
        });

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            process.env.JWT_SECRET || "your-secret-key",
            { expiresIn: "24h" }
        );

        // Return user data (without password) and token
        const { passwordHash: _, ...userWithoutPassword } = newUser;
        
        res.status(201).json({
            message: "User created successfully",
            user: userWithoutPassword,
            token
        });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ 
            error: "Internal server error during signup" 
        });
    }
});

// LOGIN ENDPOINT
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                error: "Email and password are required" 
            });
        }

        // Find user by email
        const user = await prisma.User.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ 
                error: "Invalid email or password" 
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        
        if (!isPasswordValid) {
            return res.status(401).json({ 
                error: "Invalid email or password" 
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || "your-secret-key",
            { expiresIn: "24h" }
        );

        // Return user data (without password) and token
        const { passwordHash: _, ...userWithoutPassword } = user;
        
        res.json({
            message: "Login successful",
            user: userWithoutPassword,
            token
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ 
            error: "Internal server error during login" 
        });
    }
});

// GET CURRENT USER ENDPOINT
router.get("/me", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
        
        const user = await prisma.User.findUnique({
            where: { id: decoded.userId }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const { passwordHash: _, ...userWithoutPassword } = user;
        
        res.json({ user: userWithoutPassword });

    } catch (error) {
        console.error("Get user error:", error);
        res.status(401).json({ error: "Invalid token" });
    }
});

export default router;
