import axios from "axios";

// const api = axios.create({
//   baseURL: "https://rev-auto-parts.onrender.com/api/inventory",
// });
const api = axios.create({
  baseURL: "http://localhost:3002/api/inventory",
});

// Product APIs
export const addProduct = (productData) => api.post("/addProduct", productData);
export const getAllProducts = () => api.get("/products");
export const getProductById = (productId) =>
  api.get(`/getProductById/${productId}`);

export const updateProductById = (productId, productData) =>
  api.put(`/updateProductById/${productId}`, productData);

export const getTopBestSellerItems = async (date = null) => {
  try {
    const response = await api.get("/products/best-seller-items", {
      params: { date },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching top best seller items:", error);
    throw error;
  }
};

export const addToProductStock = async (productId, quantityToAdd) => {
  try {
    const response = await api.put(`/addToProductStock/${productId}`, {
      quantityToAdd,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to add stock. Please try again later.");
    }
  }
};

export const getTotalStock = async (date = null) => {
  try {
    const response = await api.get("/products/totalNumberOfStocks", {
      params: { date },
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      "Failed to fetch total stock. Please try again later.";
    console.error("Error fetching total stock:", errorMessage);
    throw new Error(errorMessage);
  }
};

export const getTotalItems = async (date = null) => {
  try {
    const response = await api.get("/products/totalNumberOfItems", {
      params: { date },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to fetch total item. Please try again later.");
    }
  }
};

export const getAllItemsByCategory = async () => {
  try {
    const response = await api.get("products/itemsByCategory");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to fetch all items by category. Please try again later."
      );
    }
  }
};

// Filter APIs
export const getProductByBrand = (brand) =>
  api.get(`/products/filter/brand?brand=${brand}`);

export const getProductByPriceRange = async (minPrice, maxPrice) => {
  try {
    const response = await api.get("/products/filter/price-range", {
      params: {
        minPrice,
        maxPrice,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products by price range:", error);
    throw error;
  }
};
export const getProductByNameOrDescription = (query) =>
  api.get(`/products/filter/nameOrDescription?query=${query}`);

export const getProductsByDateRange = (startDate, endDate) =>
  api.get(
    `/products/filter/dateRange?startDate=${startDate}&endDate=${endDate}`
  );

export const getLowStockProducts = async (date = null) => {
  try {
    const response = await api.get("/products/filter/lowStocks", {
      params: { date },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to fetch low stock products. Please try again later."
      );
    }
  }
};

export const getAllProductsByStatus = async (status) => {
  if (!status) {
    throw new Error("Product status is required to fetch products.");
  }

  try {
    const response = await api.get("/products/filter/status", {
      params: { status },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products by status:", error);

    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error(
        "Failed to fetch products by status. Please try again later."
      );
    }
  }
};

// Pending Stock APIs
export const addPendingStock = (pendingStockData) =>
  api.post("/products/pendingStocks/add-pendingStock", pendingStockData);
export const confirmStock = (id) =>
  api.put(`/products/pendingStocks/confirm-stock/${id}`);
export const cancelPendingStock = (id) =>
  api.put(`/products/pendingStocks/cancel-stock/${id}`);
export const getAllPendingStocks = () => api.get("/products/pending-stocks");
export const updateArrivalDate = (id, newArrivalDate) =>
  api.put(`/products/pendingStocks/updateArrivalDate/${id}`, {
    newArrivalDate,
  });
