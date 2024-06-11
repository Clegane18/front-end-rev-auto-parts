import axios from "axios";

const BASE_URL = "http://localhost:3002/api/auth"; // Adjust the base URL as necessary

export const adminLogIn = async ({ email, password }) => {
  try {
    const response = await axios.post(`${BASE_URL}/logInAdmin`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error in admin log in:", error.response || error.message);
    throw error;
  }
};
