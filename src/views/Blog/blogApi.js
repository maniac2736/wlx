import server from "../../config/server";

export const fetchPosts = async () => {
  try {
    const res = await server.get("/posts");
    if (res.data.success) {
      return {
        success: true,
        data: res.data.posts,
        message: res.data.message || "Posts fetched successfully",
      };
    }
    return { success: false, data: [], message: res.data.message };
  } catch (error) {
    return {
      success: false,
      data: [],
      message: error?.response?.data?.message || "Oops something went wrong",
    };
  }
};

// Fetch single post by ID
export const fetchPostById = async (id) => {
  try {
    const res = await server.get(`/posts/${id}`);
    if (res.data.success) {
      return {
        success: true,
        data: res.data.post,
        message: res.data.message || "Post fetched successfully",
      };
    }
    return { success: false, data: null, message: res.data.message };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error?.response?.data?.message || "Oops something went wrong",
    };
  }
};

// Create a post (Admin)
// blogApi.js
export const createPost = async (formDataState) => {
  try {
    const data = new FormData();
    data.append("slug", formDataState.slug);
    data.append("published", formDataState.published);

    // Prepare sections and append files
    const sectionsToSend = formDataState.sections.map((section, index) => {
      const tempId = `section-${index}`;

      // Append actual File objects from the state
      // Note: We use the tempId in the filename so the backend can filter them
      section.rawFiles.forEach((file) => {
        data.append("images", file, `${tempId}_${file.name}`);
      });

      return {
        title: section.title,
        body: section.body,
        tempId: tempId, // Match this in the backend
      };
    });

    data.append("sections", JSON.stringify(sectionsToSend));

    const res = await server.post("/admin/posts", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return { success: true, data: res.data.post, message: res.data.message };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || "Error",
    };
  }
};

// Update a post (Admin)
export const updatePost = async ({ id, slug, published, sections }) => {
  try {
    const res = await server.put(`/admin/posts/${id}`, {
      slug,
      published,
      sections,
    });
    if (res.data.success) {
      return {
        success: true,
        data: res.data.post,
        message: res.data.message || "Post updated successfully",
      };
    }
    return { success: false, data: null, message: res.data.message };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error?.response?.data?.message || "Failed to update post",
    };
  }
};

// Delete a post (Admin)
export const deletePost = async (id) => {
  try {
    const res = await server.delete(`/admin/posts/${id}`);
    if (res.data.success) {
      return {
        success: true,
        data: null,
        message: res.data.message || "Post deleted successfully",
      };
    }
    return { success: false, data: null, message: res.data.message };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error?.response?.data?.message || "Failed to delete post",
    };
  }
};
