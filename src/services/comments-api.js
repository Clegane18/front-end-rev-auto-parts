import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3002/api/comments",
});

export const createComment = async (
  { customerId, rating, commentText, images },
  token,
  productId
) => {
  try {
    const formData = new FormData();
    formData.append("customerId", customerId);
    formData.append("rating", rating);

    if (commentText) {
      formData.append("commentText", commentText);
    }

    if (images && images.length > 0) {
      images.forEach((image, index) => {
        formData.append("images", image);
      });
    }

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
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to create comment. Please try again later.");
    }
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
