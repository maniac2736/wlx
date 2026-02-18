const express = require("express");
const UserController = require("../controller/user-controller");
const PostController = require("../controller/blog-controller");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// Public Auth Routes
router.post("/register", UserController.Register);
router.post("/login", UserController.Login);
router.post("/forgot-password", UserController.ForgotPassword);
router.post("/reset-password", UserController.ResetPassword);

// Protected User Routes
router.get("/fetch-profile", auth, UserController.getUserProfile);
router.post("/logout", auth, UserController.Logout);
router.put("/user/profile", auth, UserController.updateOwnProfile);
router.post("/change-password", auth, UserController.changePassword);
router.put("/user/profile-image", auth, UserController.updateProfileImage);

// Admin Routes
router.get("/admin/users", auth, adminAuth, UserController.getAllUsers);
router.put("/admin/users/:id", auth, adminAuth, UserController.updateUser);
router.delete("/admin/users/:id", auth, adminAuth, UserController.deleteUser);

// Blog Routes
router.get("/posts", PostController.getAllPosts);
router.get("/posts/:id", PostController.getPostById);
router.post("/admin/posts", auth, adminAuth, PostController.createPost);
router.put("/admin/posts/:id", auth, adminAuth, PostController.updatePost);
router.delete("/admin/posts/:id", auth, adminAuth, PostController.deletePost);

module.exports = router;
