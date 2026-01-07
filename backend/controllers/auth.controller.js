import prisma from "../prisma/client.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * =========================
 * REGISTER USER
 * =========================
 */
export const register = async (req, res) => {
  try {
    const { email, password, role, fullName } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    // Check existing user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user (isActive defaults to true in Prisma)
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: role || "TECHNICIAN",
        fullName,
      },
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

/**
 * =========================
 * LOGIN USER
 * =========================
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // User not found
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // 🚫 Block inactive users
    if (!user.isActive) {
      return res.status(403).json({
        message: "Account is deactivated. Contact admin.",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({
      message: "Login failed",
    });
  }
};
