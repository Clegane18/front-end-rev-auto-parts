import axios from "axios";
import config from "../config";

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? config.commentsDev
      : config.commentsProd,
});

export const createComment = async (formData, token, productId) => {
  try {
    const response = await api.post(
      `/products/${productId}/comments`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllComments = async ({ productId }) => {
  try {
    const response = await api.get(`/products/${productId}/all-comments`);

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to fetch comments. Please try again later.");
    }
  }
};

export const verifyCustomerProductPurchase = async (
  { customerId, productId },
  token
) => {
  try {
    const response = await api.get(`/verify-purchase/${productId}`, {
      params: {
        customerId,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to verify purchase. Please try again later.");
    }
  }
};
