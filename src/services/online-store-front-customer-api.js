import axios from "axios";

// const api = axios.create({
//   baseURL: "https://rev-auto-parts.onrender.com/api/customer",
// });
const api = axios.create({
  baseURL: "http://localhost:3002/api/customer",
});

export const signUp = async ({
  username,
  email,
  password,
  confirmPassword,
}) => {
  try {
    const response = await api.post("/signUp", {
      username,
      email,
      password,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error in signUp:",
      error.response ? error.response.data : error.message
    );
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to sign up. Please try again later.");
    }
  }
};

export const verifyPin = async ({ email, pin }) => {
  try {
    const response = await api.post("/verify-pin", {
      email,
      pin,
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error in verifyPin:",
      error.response ? error.response.data : error.message
    );
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to verify PIN. Please try again later.");
    }
  }
};

export const login = async ({ email, password }) => {
  try {
    const response = await api.post(
      "/login",
      {
        email,
        password,
      },
      {
        validateStatus: () => true,
      }
    );
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error(
      "Error in login:",
      error.response ? error.response.data : error.message
    );
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to log in. Please try again later.");
    }
  }
};

export const requestResetPassword = async (email) => {
  try {
    const response = await api.post("/request-reset-password", { email });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to request password reset. Please try again later."
      );
    }
  }
};

export const resetPassword = async (token, newPassword, confirmPassword) => {
  try {
    const response = await api.post(`/reset-password/${token}`, {
      newPassword,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to reset password. Please try again later.");
    }
  }
};

export const getCustomerProfile = async (userId, token) => {
  try {
    const response = await api.get(`/profile/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error in getCustomerProfile:",
      error.response ? error.response.data : error.message
    );
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to fetch customer profile. Please try again later."
      );
    }
  }
};

export const updateCustomer = async ({
  customerId,
  username,
  phoneNumber,
  gender,
  dateOfBirth,
  token,
}) => {
  try {
    const response = await api.put(
      `/profile/update/${customerId}`,
      {
        username,
        phoneNumber,
        gender,
        dateOfBirth,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in updateCustomer:",
      error.response ? error.response.data : error.message
    );
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to update customer. Please try again later.");
    }
  }
};

export const getAllCustomers = async () => {
  try {
    const response = await api.get("/customers");
    return response.data;
  } catch (error) {
    console.error(
      "Error in getAllCustomers:",
      error.response ? error.response.data : error.message
    );
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to fetch customers. Please try again later.");
    }
  }
};

export const toggleCustomerStatus = async (customerId, currentStatus) => {
  try {
    const response = await api.put(
      `/customers/${customerId}/account-status/toggle-status`,
      {
        currentStatus,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error in toggleCustomerStatus:",
      error.response ? error.response.data : error.message
    );
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to update customer status. Please try again later."
      );
    }
  }
};

export const getCustomerOnlinePurchaseHistory = async (customerId) => {
  try {
    const response = await api.get(`/order-history/${customerId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error in getCustomerOnlinePurchaseHistory:",
      error.response ? error.response.data : error.message
    );
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to retrieve customer purchase history. Please try again later."
      );
    }
  }
};

export const deleteCustomerById = async (customerId) => {
  try {
    const response = await api.delete(`/delete-account/${customerId}`);

    return response.data;
  } catch (error) {
    console.error(
      "Error in deleteCustomerById:",
      error.response ? error.response.data : error.message
    );

    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to delete the customer. Please try again later.");
    }
  }
};

export const requestChangePassword = async (email) => {
  try {
    const response = await api.post("/request-change-password", { email });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to request change password. Please try again later."
      );
    }
  }
};

export const changePassword = async (token, newPassword, confirmPassword) => {
  try {
    const response = await api.post(`/change-password/${token}`, {
      newPassword,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to change password. Please try again later.");
    }
  }
};

export const verifyOldPassword = async ({ customerId, oldPassword, token }) => {
  try {
    const response = await api.post(
      `/verify-old-password`,
      {
        customerId,
        oldPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error in verifyOldPassword:",
      error.response ? error.response.data : error.message
    );
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.message || "Failed to verify old password."
      );
    } else {
      throw new Error("Failed to verify old password. Please try again later.");
    }
  }
};

export const updatePassword = async ({
  customerId,
  newPassword,
  confirmPassword,
  token,
}) => {
  try {
    const response = await api.post(
      `/update-password`,
      {
        customerId,
        newPassword,
        confirmPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error in updatePassword:",
      error.response ? error.response.data : error.message
    );
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.message || "Failed to update password."
      );
    } else {
      throw new Error("Failed to update password. Please try again later.");
    }
  }
};

export const getPasswordChangeMethod = async ({ customerId, token }) => {
  try {
    const response = await api.get("/password-change-method", {
      params: { customerId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error in getPasswordChangeMethod API call:",
      error.response ? error.response.data : error.message
    );
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.message ||
          "Failed to determine password change method."
      );
    } else {
      throw new Error(
        "Failed to determine password change method. Please try again later."
      );
    }
  }
};
