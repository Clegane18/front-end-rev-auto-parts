import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3002/api/inventory",
});

// Product APIs
export const addProduct = (productData) => api.post("/addProduct", productData);
export const getAllProducts = () => api.get("/products");
export const getProductById = (productId) =>
  api.get(`/getProductById`, { params: { productId } });

export const updateProductById = (productId, productData) =>
  api.put(`/updateProductById/${productId}`, productData);

export const permanentlyDeleteArchivedProduct = async (productId) => {
  try {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(`Error deleting product: ${error.response.data.message}`);
    } else {
      throw new Error("Failed to delete product. Please try again later.");
    }
  }
};

export const getTopBestSellerItems = async () => {
  try {
    const response = await api.get("/products/best-seller-items");
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

export const getTotalStock = async () => {
  try {
    const response = await api.get("/products/totalNumberOfStocks");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to fetch total stock. Please try again later.");
    }
  }
};

export const getTotalItems = async () => {
  try {
    const response = await api.get("/products/totalNumberOfItems");
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

export const archiveProductById = async (productId) => {
  try {
    const response = await api.post(`/products/archive/${productId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to archive product. Please try again later.");
    }
  }
};

export const fetchAllArchivedProducts = async () => {
  try {
    const response = await api.get("/archive/products");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to fetch archived products. Please try again later."
      );
    }
  }
};
export const restoreArchivedProductById = async (productId) => {
  try {
    const response = await api.post(`/archive/restore/${productId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to restore archived products. Please try again later."
      );
    }
  }
};

export const restoreMultipleArchivedProducts = async (productIds) => {
  try {
    const response = await api.post("/archive/restore-multiple", {
      productIds,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to restore multiple archived products. Please try again later."
      );
    }
  }
};

// Filter APIs
export const getProductByBrand = (brand) =>
  api.get(`/products/filter/brand?brand=${brand}`);
export const getProductByPriceRange = (minPrice, maxPrice) =>
  api.get(
    `/products/filter/price-range?minPrice=${minPrice}&maxPrice=${maxPrice}`
  );
export const getProductByNameOrDescription = (query) =>
  api.get(`/products/filter/nameOrDescription?query=${query}`);

export const getProductsByDateRange = (startDate, endDate) =>
  api.get(
    `/products/filter/dateRange?startDate=${startDate}&endDate=${endDate}`
  );

export const getLowStockProducts = async () => {
  try {
    const response = await api.get("/products/filter/lowStocks");
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
