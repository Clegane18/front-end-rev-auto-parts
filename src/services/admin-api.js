import axios from "axios";
import config from "../config";

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "development" ? config.adminDev : config.adminProd,
});

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
