import axios from "axios";

// const api = axios.create({
//   baseURL: "https://rev-auto-parts.onrender.com/api/address",
// });
const api = axios.create({
  baseURL: "http://localhost:3002/api/address",
});

export const addAddress = async ({
  id,
  phoneNumber,
  fullName,
  region,
  province,
  city,
  barangay,
  postalCode,
  addressLine,
  label,
  isSetDefaultAddress,
  token,
}) => {
  try {
    const response = await api.post(
      `/addAddress/${id}`,
      {
        phoneNumber,
        fullName,
        region,
        province,
        city,
        barangay,
        postalCode,
        addressLine,
        label,
        isSetDefaultAddress,
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
      "Error in addAddress:",
      error.response ? error.response.data : error.message
    );
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to add address. Please try again later.");
    }
  }
};

export const updateAddress = async ({
  addressId,
  customerId,
  phoneNumber,
  fullName,
  region,
  province,
  city,
  barangay,
  postalCode,
  addressLine,
  label,
  isSetDefaultAddress,
  token,
}) => {
  try {
    const response = await api.put(
      `/updateAddress/${addressId}`,
      {
        customerId,
        phoneNumber,
        fullName,
        region,
        province,
        city,
        barangay,
        postalCode,
        addressLine,
        label,
        isSetDefaultAddress,
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
      "Error in updateAddress:",
      error.response ? error.response.data : error.message
    );
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to update address. Please try again later.");
    }
  }
};

export const deleteAddress = async ({ addressId, customerId, token }) => {
  try {
    const response = await api.delete(`/deleteAddress/${addressId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        customerId,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error in deleteAddress:",
      error.response ? error.response.data : error.message
    );
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to delete address. Please try again later.");
    }
  }
};

export const getAddresses = async (token) => {
  try {
    const response = await api.get("/addresses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      console.error("Unexpected response format:", response.data);
      return [];
    }
  } catch (error) {
    console.error(
      "Error in getAddresses:",
      error.response ? error.response.data : error.message
    );
    if (error.response && error.response.status === 404) {
      throw new Error(
        error.response.data.message || "You don't have addresses yet."
      );
    } else {
      throw new Error("Failed to fetch addresses. Please try again later.");
    }
  }
};

export const setDefaultAddress = async ({ addressId, customerId, token }) => {
  try {
    const response = await api.post(
      `/set-default-address/${addressId}`,
      { customerId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error in setDefaultAddress:",
      error.response ? error.response.data : error.message
    );
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to set default address. Please try again later.");
    }
  }
};

export const getAddressById = async ({ addressId, token }) => {
  try {
    const response = await api.post(
      `/address-details/${addressId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error in getAddressById:",
      error.response ? error.response.data : error.message
    );
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to retrieve address details. Please try again later."
      );
    }
  }
};
