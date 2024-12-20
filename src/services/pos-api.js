import axios from "axios";

const BASE_URL = "https://rev-auto-parts.onrender.com/api";

// const BASE_URL = "http://localhost:3002/api";

export const searchProducts = async (query) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/inventory/products/filter/nameOrDescription`,
      {
        params: query,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

export const getProductByItemCode = async (productItemCode) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/inventory/products/filter/itemCode`,
      {
        params: { productItemCode },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error searching product by item code:", error);
    throw error;
  }
};

export const buyProductsOnPhysicalStore = async (payload, authToken) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/transactions/products/buyProducts`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error purchasing products:",
      error.response || error.message
    );
    throw error;
  }
};

export const searchPublishedProducts = async (query) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/inventory/online-products/filter/nameOrDescription`,
      {
        params: query,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error searching published products:", error);
    throw error;
  }
};
