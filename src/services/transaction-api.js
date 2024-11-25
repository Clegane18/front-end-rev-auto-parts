import axios from "axios";

// const BASE_URL = "https://rev-auto-parts.onrender.com/api/transactions";

const BASE_URL = "http://localhost:3002/api/transactions";

export const getTotalNumberTransactions = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/today/total`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching total count of transactions today:",
      error.response || error.message
    );
    throw error;
  }
};

export const getTotalCountOfTransactionsFromPOS = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/today/total/pos`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching total count of transactions from POS:",
      error.response || error.message
    );
    throw error;
  }
};

export const getTotalCountOfTransactionsFromOnline = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/today/total/online`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching total count of transactions from online store front:",
      error.response || error.message
    );
    throw error;
  }
};

export const getTodaysTransactions = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/today`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching today's transactions:",
      error.response || error.message
    );
    throw error;
  }
};

export const calculateTotalIncomeByMonth = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/income/totalMonthlyIncome`);
    return response.data;
  } catch (error) {
    console.error(
      "Error calculating total income by month:",
      error.response || error.message
    );
    throw error;
  }
};

export const calculateTotalIncome = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/income/totalIncome`);
    return response.data;
  } catch (error) {
    console.error(
      "Error calculating total income:",
      error.response || error.message
    );
    throw error;
  }
};
