import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3002/api/auth/online-store-front",
});

export const uploadProductImage = async (productId, file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(`/uploadPhoto/${productId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to upload product image. Please try again later."
      );
    }
  }
};

export const getProductByIdAndPublish = async (productId) => {
  try {
    const response = await api.post(
      `products/getProductByIdAndPublish/${productId}`
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to publish product by product id. Please try again later."
      );
    }
  }
};

export const getPublishedItemsByCategory = async () => {
  try {
    const response = await api.get("products/publishedItems");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to fetch all ready items by category. Please try again later."
      );
    }
  }
};

export const unpublishItemByProductId = async (productId) => {
  try {
    const response = await api.post(`products/unpublishedItem/${productId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to unpublish item by product id. Please try again later."
      );
    }
  }
};

export const republishItemByProductId = async () => {
  try {
    const response = await api.post("products/republishItem/:productId");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to republish item by product id. Please try again later."
      );
    }
  }
};
