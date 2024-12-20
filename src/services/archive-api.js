import axios from "axios";

const api = axios.create({
  baseURL: "https://rev-auto-parts.onrender.com/api/archives",
});

// const api = axios.create({
//   baseURL: "http://localhost:3002/api/archives",
// });

export const archiveProductById = async (productId, authToken) => {
  try {
    const response = await api.post(`/products/archive/${productId}`, null, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to archive product. Please try again later.");
    }
  }
};

export const fetchAllArchivedProducts = async (sortOrder = "ASC") => {
  try {
    const response = await api.get("archived/products", {
      params: { sortOrder },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to fetch archived products. Please try again later."
      );
    }
  }
};

export const restoreArchivedProductById = async (productId) => {
  try {
    const response = await api.post(`/archive/restore/${productId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to restore archived products. Please try again later."
      );
    }
  }
};

export const restoreMultipleArchivedProducts = async (productIds) => {
  try {
    const response = await api.post("/archive/restore-multiple", {
      productIds,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to restore multiple archived products. Please try again later."
      );
    }
  }
};

export const restoreAllArchivedProducts = async () => {
  try {
    const response = await api.post("/archive/restore-all");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to restore all archived products. Please try again later."
      );
    }
  }
};

export const permanentlyDeleteArchivedProduct = async (
  productId,
  authToken
) => {
  try {
    const response = await api.delete(`/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(`Error deleting product: ${error.response.data.message}`);
    } else {
      throw new Error("Failed to delete product. Please try again later.");
    }
  }
};

export const deleteAllArchivedProducts = async (authToken) => {
  try {
    const response = await api.post("/archive/delete-all", null, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to delete all archived products. Please try again later."
      );
    }
  }
};

export const autoDeleteArchivedProducts = async () => {
  try {
    const response = await api.post("/auto-delete");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to perform automatic deletion of archived products. Please try again later."
      );
    }
  }
};
