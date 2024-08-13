import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3002/api/customer",
});

export const signUp = async ({ username, email, password }) => {
  try {
    const response = await api.post("/signUp", {
      username,
      email,
      password,
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

export const login = async ({ email, password }) => {
  try {
    const response = await api.post("/login", {
      email,
      password,
    });
    return response.data;
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
