import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3002/api/location",
});

export const getRegions = async () => {
  try {
    const response = await api.get("/locations/regions");
    return response.data.data;
  } catch (error) {
    console.error(
      "Error in getRegions:",
      error.response ? error.response.data : error.message
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to get regions. Please try again later."
    );
  }
};

export const getProvinces = async (regionCode) => {
  try {
    const response = await api.get(
      `/locations/provinces?regionCode=${regionCode}`
    );
    return response.data.data;
  } catch (error) {
    console.error(
      "Error in getProvinces:",
      error.response ? error.response.data : error.message
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to get provinces. Please try again later."
    );
  }
};

export const getCitiesAndMunicipalities = async (provinceCode) => {
  try {
    const response = await api.get(
      `/locations/cities-municipalities?provinceCode=${provinceCode}`
    );
    return response.data.data;
  } catch (error) {
    console.error(
      "Error in getCitiesAndMunicipalities:",
      error.response ? error.response.data : error.message
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to get cities and municipalities. Please try again later."
    );
  }
};

export const getBarangays = async (municipalityCode) => {
  try {
    const response = await api.get(
      `/locations/barangays?municipalityCode=${municipalityCode}`
    );
    return response.data.data;
  } catch (error) {
    console.error(
      "Error in getBarangays:",
      error.response ? error.response.data : error.message
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to get barangays. Please try again later."
    );
  }
};
