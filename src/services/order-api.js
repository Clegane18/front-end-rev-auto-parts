import axios from "axios";

const api = axios.create({
  baseURL: "https://rev-auto-parts.onrender.com/api/order",
});
// const api = axios.create({
//   baseURL: "http://localhost:3002/api/order",
// });

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

export const createOrder = async ({
  customerId,
  addressId,
  items,
  paymentMethod,
  gcashReferenceNumber,
  token,
}) => {
  try {
    const response = await api.post(
      `/create-order/${addressId}`,
      {
        customerId,
        items,
        paymentMethod,
        gcashReferenceNumber,
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

export const getOrdersByStatus = async ({ status, customerId, token }) => {
  try {
    const response = await api.get("/orders/status", {
      params: {
        status,
        customerId,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      return {
        status: error.response.status,
        message: error.response.data.message,
      };
    } else {
      return {
        status: 500,
        message: "No Orders Yet.",
      };
    }
  }
};

export const cancelOrder = async ({ orderId, token, cancellationReason }) => {
  try {
    const response = await api.post(
      `/orders/${orderId}/cancel`,
      { cancellationReason },
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
      throw new Error("Failed to cancel order. Please try again later.");
    }
  }
};

export const getCancellationCounts = async (date = null) => {
  try {
    const response = await api.get("/orders/cancel-reason-count", {
      params: { date },
    });
    if (response && response.data) {
      return response.data;
    }
    throw new Error("Failed to fetch cancellation counts.");
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while fetching cancellation counts.");
  }
};

export const getAllOrders = async () => {
  try {
    const response = await api.get("/orders");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to fetch all Orders. Please try again later.");
    }
  }
};

export const updateOrderStatus = async (orderId, newStatus, authToken) => {
  try {
    const response = await api.put(
      `/orders/${orderId}/update-status`,
      { newStatus },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to update order status. Please try again later.");
    }
  }
};

export const updateOrderETA = async (orderId, newETA, authToken) => {
  try {
    const response = await api.put(
      `/orders/${orderId}/update-ETA`,
      { newETA },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to update order ETA. Please try again later.");
    }
  }
};

export const deleteOrderById = async (orderId, authToken) => {
  try {
    const response = await api.delete(`/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return {
      status: response.status,
      message: response.data.message,
    };
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to delete order. Please try again later.");
    }
  }
};

export const updateOrderPaymentStatus = async (
  orderId,
  newPaymentStatus,
  authToken
) => {
  try {
    const response = await api.put(
      `/orders/${orderId}/update-payment-status`,
      { newPaymentStatus },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to update order payment status. Please try again later."
      );
    }
  }
};

export const getAllOrdersByStatus = async (status) => {
  if (!status) {
    throw new Error("Order status is required to fetch orders.");
  }

  try {
    const response = await api.get("/orders-list/status", {
      params: { status },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders by status:", error);

    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error(
        "Failed to fetch all orders by status. Please try again later."
      );
    }
  }
};

export const getAllOrdersByPaymentStatus = async (paymentStatus) => {
  if (!paymentStatus) {
    throw new Error("Order payment status is required to fetch orders.");
  }

  try {
    const response = await api.get("/orders-list/payment-status", {
      params: { paymentStatus },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders by payment status:", error);

    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error(
        "Failed to fetch all orders by payment status. Please try again later."
      );
    }
  }
};
