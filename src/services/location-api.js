import axios from "axios";

const api = axios.create({
  baseURL: "https://rev-auto-parts.onrender.com/api/location",
});
// const api = axios.create({
//   baseURL: "http://localhost:3002/api/location",
// });

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

export const getProvincesOrCities = async (regionCode) => {
  try {
    const response = await api.get(
      `/locations/provinces-or-cities?regionCode=${regionCode}`
    );
    return response.data.data;
  } catch (error) {
    console.error(
      "Error in getProvincesOrCities:",
      error.response ? error.response.data : error.message
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to get provinces or cities. Please try again later."
    );
  }
};

export const getCitiesAndMunicipalities = async (provinceOrCityCode) => {
  try {
    const response = await api.get(
      `/locations/cities-municipalities?provinceOrCityCode=${provinceOrCityCode}`
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

export const getBarangays = async (
  municipalityOrCityCode,
  regionCode = null
) => {
  try {
    const queryParams = regionCode
      ? `municipalityOrCityCode=${municipalityOrCityCode}&regionCode=${regionCode}`
      : `municipalityOrCityCode=${municipalityOrCityCode}`;

    const response = await api.get(`/locations/barangays?${queryParams}`);

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

export const checkMetroManilaStatus = async (region, city) => {
  try {
    const response = await api.post("/locations/check-metro-manila", {
      region,
      city,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error in checkMetroManilaStatus:",
      error.response ? error.response.data : error.message
    );
    throw new Error(
      error.response?.data?.message ||
        "Failed to check Metro Manila status. Please try again later."
    );
  }
};
