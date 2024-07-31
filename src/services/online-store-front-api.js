import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3002/api/auth/online-store-front",
});

export const uploadProductPhotos = async (productId, productPhotos) => {
  try {
    const formData = new FormData();

    Array.from(productPhotos).forEach((photo) => {
      formData.append("productPhotos", photo);
    });

    const response = await api.post(`/uploadPhotos/${productId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(`Error uploading photos: ${error.response.data.message}`);
    } else {
      throw new Error("Failed to upload photos. Please try again later.");
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

export const unpublishItemByProductId = async () => {
  try {
    const response = await api.post("products/unpublishedItem/:productId");
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
