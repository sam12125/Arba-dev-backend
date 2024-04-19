const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");

// Generate a random secure secret key
const generateSecretKey = () => {
  return crypto.randomBytes(32).toString("hex");
};

const jwtSecretKey = generateSecretKey();
console.log("JWT Secret Key:", jwtSecretKey);

router.get("/data", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Register
router.post("/register", async (req, res) => {
  try {
    // Check if email or username already exists
    const existingUser = await User.findOne({
      $or: [{ email: req.body.email }, { userName: req.body.userName }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user
    const newUser = new User({
      fullName: req.body.fullName,
      userName: req.body.userName,
      email: req.body.email,
      password: hashedPassword,
      avatar: req.body.avatar,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", user: savedUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    // Find the user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, "secret-key", {
      expiresIn: "1h",
    });
    console.log(token);

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/user/:id", async (req, res) => {
  const { id } = req.params;
  const { email, fullName, userName, avatar } = req.body;

  try {
    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields if provided in request body
    if (email) user.email = email;
    if (fullName) user.fullName = fullName;
    if (userName) user.userName = userName;
    if (avatar) user.avatar = avatar;

    // Save updated user
    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Forgot Password
// router.post("/forgot-password", (req, res) => {
//   // Implementation for forgot password endpoint
// });

module.exports = router;
