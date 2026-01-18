const { userSchema } = require("../joi-validation/user-validation");
const { User } = require("../models");
const { hashPassword } = require("../utils/hash-password");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.Register = async (req, res) => {
  const {
    firstName,
    lastName,
    address,
    contact,
    email,
    username,
    password,
    image,
  } = req.body;

  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const existingEmail = await User.findOne({
    where: {
      email: email,
    },
  });
  if (existingEmail) {
    return res.status(400).json({
      success: false,
      message: "Email already exists. Please enter a different one.",
    });
  }

  const existingUsername = await User.findOne({
    where: {
      username: username,
    },
  });
  if (existingUsername) {
    return res.status(400).json({
      success: false,
      message: "Username already exists. Please choose a different one.",
    });
  }

  if (
    !firstName ||
    !lastName ||
    !address ||
    !contact ||
    !email ||
    !username ||
    !password ||
    image
  ) {
    return res.status(400).json({ message: "Provide all required details!" });
  }

  const hashedPassword = hashPassword(password);

  try {
    const user = await User.create({
      firstName,
      lastName,
      address,
      contact,
      email,
      username,
      password: hashedPassword,
      image,
    });
    res.status(201).json({ message: "User registered successfully!", user });
  } catch (error) {
    console.error("Error Creating User:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.Login = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("Received credentials:", { username, password });

    const user = await User.findOne({
      attributes: [
        "id",
        "firstName",
        "lastName",
        "address",
        "contact",
        "email",
        "username",
        "password",
        "image",
        "createdAt",
      ],
      where: {
        username: username,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const {
      id,
      firstName,
      lastName,
      address,
      contact,
      email,
      image,
      createdAt,
    } = user;

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect Password" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    console.log("Generated token:", token);

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false, // false for localhost development
      sameSite: "lax", // Use "lax" instead of "none" for localhost
      path: "/",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      domain: "localhost", // Explicitly set domain
    });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        id,
        firstName,
        lastName,
        address,
        contact,
        email,
        username,
        image,
        createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.getUserProfile = async (req, res) => {
  const userId = req.userId;
  console.log("User ID", userId);

  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

module.exports.Logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });
    return res.status(200).json({ message: "Logged out!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
