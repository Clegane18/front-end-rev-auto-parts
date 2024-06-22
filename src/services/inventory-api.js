import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3002/api/auth",
});

// Product APIs
export const addProduct = (productData) => api.post("/addProduct", productData);
export const getAllProducts = () => api.get("/products");
export const getProductById = (productId) =>
  api.get(`/getProductById/${productId}`);
export const updateProductById = (productId, productData) =>
  api.put(`/updateProductById/${productId}`, productData);
export const deleteProductById = (productId) =>
  api.delete(`/products/${productId}`);
export const addToProductStock = (productId, quantityToAdd) =>
  api.put(`/addToProductStock/${productId}`, { quantityToAdd });

// Filter APIs
export const getProductByItemCode = (productItemCode) =>
  api.get(`/products/itemCode/${productItemCode}`);
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
