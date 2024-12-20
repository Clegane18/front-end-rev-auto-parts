import axios from "axios";

const api = axios.create({
  baseURL: "https://rev-auto-parts.onrender.com/api/online-store-front",
});
// const api = axios.create({
//   baseURL: "http://localhost:3002/api/online-store-front",
// });

export const uploadProductImages = async (productId, files, authToken) => {
  try {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await api.post(`/uploadPhotos/${productId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading product images:", error);

    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to upload product images. Please try again later."
      );
    }
  }
};

export const getProductByIdAndPublish = async (productId, authToken) => {
  try {
    const response = await api.post(
      `products/getProductByIdAndPublish/${productId}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error publishing product by ID:", error);

    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to publish product by product ID. Please try again later."
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

export const unpublishItemByProductId = async (productId, authToken) => {
  try {
    const response = await api.post(
      `products/unpublishedItem/${productId}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error unpublishing product by ID:", error);

    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to unpublish item by product ID. Please try again later."
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

    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
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

export const deleteProductImageById = async ({ productImageId, authToken }) => {
  try {
    const response = await api.delete(
      `/products/${productImageId}/delete-product-image`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    return response.data.message;
  } catch (error) {
    console.error("Error deleting product image by ID:", error);

    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to delete product image. Please try again later."
      );
    }
  }
};

export const changePrimaryProductImageById = async ({ productImageId }) => {
  try {
    const response = await api.put(
      `/products/${productImageId}/change-primary-product-image`
    );

    return response.data.message;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to change primary product image. Please try again later."
      );
    }
  }
};

export const getAllProductImagesByProductId = async ({ productId }) => {
  try {
    const response = await api.get(`/products/${productId}/images`);

    return response.data.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to fetching all product images. Please try again later."
      );
    }
  }
};

export const uploadShowcaseImages = async (files, authToken) => {
  try {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await api.post("/showcase-upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading showcase images:", error);

    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to upload showcase images. Please try again later."
      );
    }
  }
};

export const getShowcaseImages = async () => {
  try {
    const response = await api.get("/showcase-images");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to fetch showcase images. Please try again later."
      );
    }
  }
};

export const deleteShowcaseImage = async (showcaseId, authToken) => {
  try {
    const response = await api.delete(`/delete-showcase-images/${showcaseId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting showcase image by ID:", error);

    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to delete showcase image. Please try again later."
      );
    }
  }
};

export const getTopSellingProducts = async (limit = 5) => {
  try {
    const response = await api.get(`/products/top-sellers`, {
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
        "Failed to fetch top-selling products. Please try again later."
      );
    }
  }
};
