const { Op } = require("sequelize");
const {
  userSchema,
  updateUserSchema,
} = require("../joi-validation/user-validation");
const { User } = require("../models");
const { hashPassword } = require("../utils/hash-password");
const sendEmail = require("../utils/mailer"); // Import the mailer
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const upload = require("../utils/multer-config");
const fs = require("fs");
const path = require("path");

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
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const existingUser = await User.findOne({
      where: { [require("sequelize").Op.or]: [{ email }, { username }] },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email or Username already exists.",
      });
    }

    const hashedPassword = hashPassword(password);

    const user = await User.create({
      firstName,
      lastName,
      address,
      contact,
      email,
      username,
      password: hashedPassword,
      image,
      role: 1,
    });

    const userResponse = user.toJSON();
    delete userResponse.password;

    res
      .status(201)
      .json({ message: "User registered successfully!", user: userResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.Login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    const invalidMsg = "Invalid username or password";

    if (!user) return res.status(401).json({ message: invalidMsg });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ message: invalidMsg });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.changePassword = async (req, res) => {
  const userId = req.user.userId;
  const { currentPassword, newPassword, confirmPassword } = req.body;

  try {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long and include at least one number and one special character.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "New passwords do not match." });
    }

    const user = await User.findByPk(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Incorrect current password." });

    const isSameAsOld = await bcrypt.compare(newPassword, user.password);
    if (isSameAsOld)
      return res
        .status(400)
        .json({ success: false, message: "Cannot reuse current password." });

    const hashedNewPassword = hashPassword(newPassword);
    await user.update({ password: hashedNewPassword });

    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Password updated. Please login again.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports.getUserProfile = async (req, res) => {
  const userId = req.user.userId;
  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

module.exports.Logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    return res.status(200).json({ message: "Logged out!" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports.updateUser = async (req, res) => {
  const { id } = req.params;

  const { error } = updateUserSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { firstName, lastName, address, contact, email, username, role } =
    req.body;
  try {
    const user = await User.findByPk(id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    await user.update({
      firstName,
      lastName,
      address,
      contact,
      email,
      username,
      role,
    });
    const updatedUser = user.toJSON();
    delete updatedUser.password;

    res
      .status(200)
      .json({ success: true, message: "Updated", user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    await user.destroy();
    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports.updateOwnProfile = async (req, res) => {
  const userId = req.user.userId;

  const { error } = updateUserSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { firstName, lastName, address, contact, email, username } = req.body;
  try {
    const user = await User.findByPk(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    await user.update({
      firstName,
      lastName,
      address,
      contact,
      email,
      username,
    });
    const updatedUser = user.toJSON();
    delete updatedUser.password;

    res
      .status(200)
      .json({ success: true, message: "Profile updated", user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports.ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ where: { email } });
    const genericMsg =
      "If an account exists with this email, a reset link has been sent.";

    if (!user) {
      return res.status(200).json({ success: true, message: genericMsg });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.update({
      resetPasswordToken,
      resetPasswordExpires,
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    // --- NODEMAILER INTEGRATION ---
    const htmlMessage = `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset for your Wallo SecureGate account.</p>
      <p>Please click the link below to reset your password. This link is valid for 15 minutes:</p>
      <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
      <p>If you did not request this, please ignore this email.</p>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request - Wallo SecureGate",
        html: htmlMessage,
      });

      return res.status(200).json({ success: true, message: genericMsg });
    } catch (mailError) {
      // If email fails, clear the tokens in DB so they aren't stuck
      await user.update({
        resetPasswordToken: null,
        resetPasswordExpires: null,
      });
      console.error("Mail Error:", mailError);
      return res.status(500).json({ message: "Email could not be sent" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.ResetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res
        .status(400)
        .json({ message: "Token and password are required" });
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long and include at least one number and one special character.",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    const hashedPassword = hashPassword(password);

    await user.update({
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    return res.status(200).json({
      success: true,
      message: "Password reset successful. You can now login.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.updateProfileImage = [
  upload.single("image"),
  async (req, res) => {
    try {
      const userId = req.user.userId;

      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No image file provided." });
      }

      const user = await User.findByPk(userId);
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "User not found." });

      // Scenario: User is CHANGING an existing image
      if (user.image) {
        // Construct the path to the existing file
        // We use path.join to go from the current folder to the root/uploads
        const oldImagePath = path.join(__dirname, "../../", user.image);

        // Delete the old file if it exists on the server
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Scenario: First time upload OR updating the record
      const newImagePath = `/uploads/${req.file.filename}`;
      await user.update({ image: newImagePath });

      return res.status(200).json({
        success: true,
        message: "Profile picture updated successfully!",
        image: newImagePath, // Send this back so the UI updates immediately
      });
    } catch (error) {
      console.error("Profile Image Error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
];
