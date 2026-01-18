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
