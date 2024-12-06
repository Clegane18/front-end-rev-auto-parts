import axios from "axios";

const api = axios.create({
  baseURL: "https://rev-auto-parts.onrender.com/api/cart",
});
// const api = axios.create({
//   baseURL: "http://localhost:3002/api/cart",
// });

export const addProductToCart = async ({ customerId, productId, token }) => {
  try {
    const response = await api.post(
      `/my-cart/add`,
      {
        customerId,
        productId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in addProductToCart:",
      error.response ? error.response.data : error.message
    );

    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to add product to cart. Please try again later.");
    }
  }
};

export const getCartItems = async ({ token }) => {
  try {
    const response = await api.get(`/my-cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error in getCartItems:",
      error.response ? error.response.data : error.message
    );

    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to fetch cart items. Please try again later.");
    }
  }
};

export const removeProductFromCart = async ({ productId, token }) => {
  try {
    const response = await api.delete(`/my-cart/remove/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error in removeProductFromCart:",
      error.response ? error.response.data : error.message
    );

    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to remove product from cart. Please try again later."
      );
    }
  }
};

export const updateCartItemQuantity = async ({
  productId,
  action,
  value,
  token,
}) => {
  try {
    const response = await api.put(
      `/my-cart/update-quantity/${productId}`,
      {
        action,
        value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in updateCartItemQuantity:",
      error.response ? error.response.data : error.message
    );

    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to update cart item quantity. Please try again later."
      );
    }
  }
};

export const getCartItemCount = async ({ token }) => {
  try {
    const response = await api.get(`/my-cart/items-count`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error in getCartItemCount:",
      error.response ? error.response.data : error.message
    );

    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to fetch cart item count. Please try again later."
      );
    }
  }
};
