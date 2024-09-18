import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3002/api/online-store-front",
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

export const getBestSellingProductsForMonth = async (limit = 5) => {
  try {
    const response = await api.get(`/products/best-sellers-for-month`, {
      params: {
        limit: limit,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to fetch best-selling products for the current month. Please try again later."
      );
    }
  }
};

export const getAllCategoriesInOnlineStoreFront = async () => {
  try {
    const response = await api.get("products/categories/");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to fetch categories from online store front. Please try again later."
      );
    }
  }
};

export const sendContactUsEmail = async ({ name, email, phone, message }) => {
  try {
    const response = await api.post("/contact-us", {
      name,
      email,
      phone,
      message,
    });

    return response.data.message;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to send email. Please try again later.");
    }
  }
};

export const updateProductPurchaseMethod = async ({
  productId,
  newPurchaseMethod,
}) => {
  try {
    const response = await api.put(`/products/${productId}/purchase-method`, {
      newPurchaseMethod,
    });

    return response.data.message;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to update purchase method. Please try again later."
      );
    }
  }
};
