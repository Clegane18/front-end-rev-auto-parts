import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3002/api/auth",
});

// Product APIs
export const addProduct = (productData) => api.post("/addProduct", productData);
export const getAllProducts = () => api.get("/products");
export const getProductById = (productId) =>
  api.get(`/getProductById`, { params: { productId } });

export const updateProductById = (productId, productData) =>
  api.put(`/updateProductById/${productId}`, productData);

export const deleteProductById = async (productId) => {
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

// Filter APIs
export const getProductByItemCode = (productItemCode) =>
  api.get(`/products/filter/itemCode`, { params: { productItemCode } });
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
export const getLowStockProducts = () => api.get("/products/filter/lowStocks");

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
