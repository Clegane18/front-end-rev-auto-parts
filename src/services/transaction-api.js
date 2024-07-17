import axios from "axios";

const BASE_URL = "http://localhost:3002/api/auth";

export const getTotalNumberTransactions = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/transactions/today/total`);
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
    const response = await axios.get(
      `${BASE_URL}/transactions/today/total/pos`
    );
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
    const response = await axios.get(
      `${BASE_URL}/transactions/today/total/online`
    );
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
    const response = await axios.get(`${BASE_URL}/transactions/today`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching today's transactions:",
      error.response || error.message
    );
    throw error;
  }
};
