import axios from "axios";

const api = axios.create({
  baseURL: "https://rev-auto-parts.onrender.com/api/audit-logs",
});
// const api = axios.create({
//   baseURL: "http://localhost:3002/api/audit-logs",
// });

export const getAllAuditLogs = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(
        `Error fetching audit logs: ${error.response.data.message}`
      );
    } else {
      throw new Error("Failed to fetch audit logs. Please try again later.");
    }
  }
};

export const getAuditLogsByDateRange = async (startDate, endDate) => {
  try {
    const response = await api.get("/date-range", {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(
        `Error fetching audit logs: ${error.response.data.message}`
      );
    } else {
      throw new Error("Failed to fetch audit logs. Please try again later.");
    }
  }
};
