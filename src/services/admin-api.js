import axios from "axios";

const api = axios.create({
  baseURL: "https://rev-auto-parts.onrender.com/api/admin",
});

// const api = axios.create({
//   baseURL: "http://localhost:3002/api/admin",
// });

export const adminLogIn = async ({ email, password }) => {
  try {
    const response = await api.post("/logInAdmin", {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to log in. Please try again later.");
    }
  }
};

export const updateAdminEmail = async (adminId, newEmail, token) => {
  try {
    const response = await api.put(
      `/${adminId}/update-email`,
      { newEmail },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to update admin email. Please try again later.");
    }
  }
};

export const updateAdminPassword = async (
  adminId,
  oldPassword,
  newPassword,
  token
) => {
  try {
    const response = await api.put(
      `/${adminId}/update-password`,
      { oldPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to update admin password. Please try again later."
      );
    }
  }
};

export const adminLogout = async (token) => {
  try {
    const response = await api.post("/logout", null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "An unexpected error occurred during logout. Please try again later."
      );
    }
  }
};
