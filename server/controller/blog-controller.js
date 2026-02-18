const { Post, PostSection, PostImage } = require("../models");
const upload = require("../utils/multer-config");

// ================= CREATE POST =================
module.exports.createPost = [
  upload.array("images", 10),
  async (req, res) => {
    try {
      const { slug, published, sections } = req.body;
      const parsedSections =
        typeof sections === "string" ? JSON.parse(sections) : sections;

      const post = await Post.create({ slug, published });

      for (let i = 0; i < parsedSections.length; i++) {
        const section = parsedSections[i];
        const postSection = await PostSection.create({
          postId: post.id,
          title: section.title,
          body: section.body,
          section_order: i + 1,
        });

        if (req.files) {
          const sectionImages = req.files
            .filter((file) => file.originalname.startsWith(section.tempId))
            .map((file, index) => ({
              sectionId: postSection.id,
              image_url: `/uploads/${file.filename}`,
              image_order: index + 1,
            }));

          if (sectionImages.length > 0) {
            await PostImage.bulkCreate(sectionImages);
          }
        }
      }

      res.status(201).json({ success: true, post });
    } catch (error) {
      console.error("Error creating post:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
];

// ================= GET ALL POSTS =================
module.exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: {
        model: PostSection,
        include: PostImage,
      },
      order: [
        ["createdAt", "DESC"],
        [PostSection, "section_order", "ASC"],
        [PostSection, PostImage, "image_order", "ASC"],
      ],
    });

    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error("Sequelize fetch error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ================= GET SINGLE POST =================
module.exports.getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findByPk(id, {
      include: {
        model: PostSection,
        include: PostImage,
      },
      order: [
        [PostSection, "section_order", "ASC"],
        [PostSection, PostImage, "image_order", "ASC"],
      ],
    });

    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    res.status(200).json({ success: true, post });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ================= UPDATE POST =================
module.exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const { slug, published, sections } = req.body;

  try {
    const post = await Post.findByPk(id);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    await post.update({ slug, published });

    if (sections && sections.length > 0) {
      const parsedSections =
        typeof sections === "string" ? JSON.parse(sections) : sections;

      const oldSections = await PostSection.findAll({ where: { postId: id } });
      for (const sec of oldSections) {
        await PostImage.destroy({ where: { sectionId: sec.id } });
      }
      await PostSection.destroy({ where: { postId: id } });

      for (let i = 0; i < parsedSections.length; i++) {
        const section = parsedSections[i];
        const postSection = await PostSection.create({
          postId: post.id,
          title: section.title,
          body: section.body,
          section_order: i + 1,
        });

        if (section.images && section.images.length > 0) {
          const imagesToCreate = section.images.map((img, index) => ({
            sectionId: postSection.id,
            image_url: img,
            image_order: index + 1,
          }));
          await PostImage.bulkCreate(imagesToCreate);
        }
      }
    }

    const updatedPost = await Post.findByPk(id, {
      include: {
        model: PostSection,
        include: PostImage,
      },
      order: [
        ["createdAt", "DESC"],
        [PostSection, "section_order", "ASC"],
        [PostSection, PostImage, "image_order", "ASC"],
      ],
    });

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ================= DELETE POST =================
module.exports.deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findByPk(id);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    await post.destroy(); // cascades to sections and images
    res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
