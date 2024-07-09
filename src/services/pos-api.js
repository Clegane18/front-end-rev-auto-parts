import axios from "axios";

const BASE_URL = "http://localhost:3002/api/auth"; // Adjust the base URL as necessary

export const searchProducts = async (query) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/products/filter/nameOrDescription`,
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

export const buyProductsOnPhysicalStore = async (payload) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/transactions/products/buyProducts`,
      payload
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

export const calculateTotalIncomeInPhysicalStore = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/transactions/income/totalIncome`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error calculating total income in physical store:",
      error.response || error.message
    );
    throw error;
  }
};

export const calculateIncomeByMonthInPhysicalStore = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/transactions/income/monthlyIncome`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error calculating total income by month in physical store:",
      error.response || error.message
    );
    throw error;
  }
};
