import server from "../../config/server";

// Fetch all transactions
export const fetchTransactions = async (page = 1, limit = 10) => {
  try {
    const res = await server.get(`/fetch?page=${page}&limit=${limit}`);
    if (res.data.success) {
      return {
        success: true,
        data: res.data.transactions,
        pagination: res.data.pagination,
        message: res.data.message,
      };
    }
    return {
      success: false,
      data: [],
      pagination: {},
      message: res.data.message,
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      pagination: {},
      message: error?.response?.data?.message || "Oops something went wrong",
    };
  }
};

// Create a transaction
export const createTransaction = async ({
  type,
  amount,
  category,
  date,
  notes,
}) => {
  try {
    const res = await server.post(`/create`, {
      type,
      amount,
      category,
      date,
      notes,
    });
    if (res.data.success)
      return {
        success: true,
        data: res.data.transaction,
        message: res.data.message,
      };
    return { success: false, data: null, message: res.data.message };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error?.response?.data?.message || "Oops something went wrong",
    };
  }
};

// Update a transaction
export const updateTransaction = async ({
  id,
  type,
  amount,
  category,
  date,
  notes,
}) => {
  try {
    const res = await server.put(`/update/${id}`, {
      type,
      amount,
      category,
      date,
      notes,
    });
    if (res.data.success)
      return {
        success: true,
        data: res.data.transaction,
        message: res.data.message,
      };
    return { success: false, data: null, message: res.data.message };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error?.response?.data?.message || "Oops something went wrong",
    };
  }
};

// Delete a transaction
export const deleteTransaction = async (id) => {
  try {
    const res = await server.delete(`/delete/${id}`);
    if (res.data.success)
      return { success: true, data: null, message: res.data.message };
    return { success: false, data: null, message: res.data.message };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error?.response?.data?.message || "Oops something went wrong",
    };
  }
};

// Register user
export const registerUser = async ({
  firstName,
  lastName,
  address,
  contact,
  email,
  username,
  password,
  image,
}) => {
  try {
    const res = await server.post("/register", {
      firstName,
      lastName,
      address,
      contact,
      email,
      username,
      password,
      image,
    });

    return {
      success: true,
      data: res.data.user,
      message: res.data.message,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error?.response?.data?.message || "Oops something went wrong",
    };
  }
};

// Login user
export const loginUser = async ({ username, password }) => {
  try {
    const res = await server.post("/login", {
      username,
      password,
    });

    return {
      success: true,
      data: res.data.data,
      message: res.data.message,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error?.response?.data?.message || "Invalid credentials",
    };
  }
};

export const fetchUserProfile = async () => {
  try {
    const res = await server.get("/fetch-profile");

    if (res.data.success) {
      return {
        success: true,
        data: res.data.user,
        message: "Profile fetched successfully",
      };
    }

    return {
      success: false,
      data: null,
      message: res.data.message,
    };
  } catch (error) {
    // Better error handling
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message || "Oops something went wrong";

    return {
      success: false,
      data: null,
      message,
      status, // Include status code
    };
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    const res = await server.post("/logout");

    return {
      success: true,
      data: null,
      message: res.data.message,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error?.response?.data?.message || "Logout failed",
    };
  }
};

export const fetchAllUsers = async () => {
  try {
    const res = await server.get("/admin/users");
    if (res.data.success) {
      return {
        success: true,
        data: res.data.users,
        message: res.data.message || "Users fetched successfully",
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

export const updateUser = async ({
  id,
  firstName,
  lastName,
  address,
  contact,
  email,
  username,
  role,
}) => {
  try {
    const res = await server.put(`/admin/users/${id}`, {
      firstName,
      lastName,
      address,
      contact,
      email,
      username,
      role,
    });

    if (res.data.success) {
      return {
        success: true,
        data: res.data.user,
        message: res.data.message || "User updated successfully",
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

export const deleteUser = async (id) => {
  try {
    const res = await server.delete(`/admin/users/${id}`);
    if (res.data.success) {
      return {
        success: true,
        data: null,
        message: res.data.message || "User deleted successfully",
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

export const updateOwnProfile = async ({
  firstName,
  lastName,
  address,
  contact,
  email,
  username,
  image,
  s,
}) => {
  try {
    const res = await server.put("/user/profile", {
      firstName,
      lastName,
      address,
      contact,
      email,
      username,
      image,
    });

    if (res.data.success) {
      return {
        success: true,
        data: res.data.user,
        message: res.data.message || "Profile updated successfully",
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

export const changePassword = async ({
  currentPassword,
  newPassword,
  confirmPassword,
}) => {
  try {
    const res = await server.post("/change-password", {
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (res.data.success) {
      return {
        success: true,
        message: res.data.message || "Password changed successfully",
      };
    }

    return { success: false, message: res.data.message };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to change password",
    };
  }
};

export const forgotPassword = async (email) => {
  try {
    const res = await server.post("/forgot-password", { email });
    return {
      success: true,
      message: res.data.message,
    };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong",
    };
  }
};

export const resetPassword = async ({ token, password }) => {
  try {
    const res = await server.post("/reset-password", {
      token,
      password,
    });
    return {
      success: true,
      message: res.data.message,
    };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || "Invalid or expired token",
    };
  }
};

export const updateProfileImage = async (file) => {
  try {
    // 1. Create FormData object
    const formData = new FormData();
    // 2. Append the file. The key 'image' must match your upload.single("image") on the backend
    formData.append("image", file);

    const res = await server.put("/user/profile-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data.success) {
      return {
        success: true,
        data: res.data.image, // This is the new image URL/path
        message: res.data.message || "Profile image updated successfully",
      };
    }

    return { success: false, data: null, message: res.data.message };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error?.response?.data?.message || "Failed to upload image",
    };
  }
};
