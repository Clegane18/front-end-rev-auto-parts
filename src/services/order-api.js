import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3002/api/order",
});

export const calculateShippingFee = async ({ addressId, token }) => {
  try {
    const response = await api.post(
      `/calculate-shipping-fee/${addressId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to calculate shipping fee. Please try again later."
      );
    }
  }
};

export const createOrder = async ({ customerId, addressId, items, token }) => {
  try {
    const response = await api.post(
      `/create-order/${addressId}`,
      {
        customerId,
        items,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to create order. Please try again later.");
    }
  }
};
